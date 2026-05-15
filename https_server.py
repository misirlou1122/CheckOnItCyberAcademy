from __future__ import annotations

import http.server
import ssl
import urllib.parse
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent
ROOT = PROJECT_ROOT / "www"
CERT = PROJECT_ROOT / "certs" / "pink-security-local-server.pem"
KEY = PROJECT_ROOT / "certs" / "pink-security-local-server-key.pem"
HOST = "0.0.0.0"
PORT = 4443


class Handler(http.server.SimpleHTTPRequestHandler):
    MIME_TYPES = {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".webmanifest": "application/manifest+json; charset=utf-8",
        ".png": "image/png",
        ".cer": "application/pkix-cert",
        ".pem": "application/x-pem-file",
    }

    def translate_path(self, path: str) -> str:
        path = urllib.parse.urlparse(path).path
        parts = [part for part in path.split("/") if part and part not in {".", ".."}]
        resolved = ROOT.joinpath(*parts) if parts else ROOT / "index.html"
        return str(resolved)

    def do_GET(self) -> None:
        file_path = Path(self.translate_path(self.path))
        if file_path.is_dir():
            file_path = file_path / "index.html"
        try:
            file_path.relative_to(ROOT)
        except ValueError:
            self.send_error(403, "Forbidden")
            return
        if not file_path.exists() or not file_path.is_file():
            self.send_error(404, "File not found")
            return

        data = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", self.MIME_TYPES.get(file_path.suffix.lower(), "application/octet-stream"))
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def end_headers(self) -> None:
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


def main() -> None:
    if not CERT.exists() or not KEY.exists():
        raise SystemExit("Missing HTTPS certificate. Run .\\make_https_cert.ps1 first.")

    httpd = http.server.ThreadingHTTPServer((HOST, PORT), Handler)
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.minimum_version = ssl.TLSVersion.TLSv1_2
    context.load_cert_chain(certfile=CERT, keyfile=KEY)
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    print(f"Serving Pink Security+ Academy at https://localhost:{PORT}/index.html")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
