$ErrorActionPreference = "Stop"

$certDir = Join-Path $PSScriptRoot "certs"
New-Item -ItemType Directory -Force -Path $certDir | Out-Null

function ConvertTo-Pem {
    param(
        [string] $Label,
        [byte[]] $Bytes
    )
    $body = [Convert]::ToBase64String($Bytes, [Base64FormattingOptions]::InsertLineBreaks)
    return "-----BEGIN $Label-----`n$body`n-----END $Label-----`n"
}

function Get-LocalIPv4Addresses {
    $lines = ipconfig | Select-String -Pattern "IPv4 Address"
    foreach ($line in $lines) {
        $value = ($line.ToString() -split ":")[-1].Trim()
        if ($value -and $value -notlike "127.*" -and $value -notlike "169.254.*") {
            $value
        }
    }
}

$rootKey = [System.Security.Cryptography.RSA]::Create(3072)
$rootReq = [System.Security.Cryptography.X509Certificates.CertificateRequest]::new(
    "CN=Pink Security Academy Local Root CA",
    $rootKey,
    [System.Security.Cryptography.HashAlgorithmName]::SHA256,
    [System.Security.Cryptography.RSASignaturePadding]::Pkcs1
)
$rootReq.CertificateExtensions.Add(
    [System.Security.Cryptography.X509Certificates.X509BasicConstraintsExtension]::new($true, $false, 0, $true)
)
$rootReq.CertificateExtensions.Add(
    [System.Security.Cryptography.X509Certificates.X509KeyUsageExtension]::new(
        [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::KeyCertSign -bor
        [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::CrlSign,
        $true
    )
)
$rootReq.CertificateExtensions.Add(
    [System.Security.Cryptography.X509Certificates.X509SubjectKeyIdentifierExtension]::new($rootReq.PublicKey, $false)
)
$rootCert = $rootReq.CreateSelfSigned(
    [DateTimeOffset]::Now.AddDays(-1),
    [DateTimeOffset]::Now.AddYears(5)
)

$serverKey = [System.Security.Cryptography.RSA]::Create(2048)
$serverReq = [System.Security.Cryptography.X509Certificates.CertificateRequest]::new(
    "CN=Pink Security Academy Local Server",
    $serverKey,
    [System.Security.Cryptography.HashAlgorithmName]::SHA256,
    [System.Security.Cryptography.RSASignaturePadding]::Pkcs1
)

$san = [System.Security.Cryptography.X509Certificates.SubjectAlternativeNameBuilder]::new()
$san.AddDnsName("localhost")
$san.AddDnsName("pink-security.local")
$san.AddIpAddress([System.Net.IPAddress]::Parse("127.0.0.1"))
Get-LocalIPv4Addresses | ForEach-Object {
    $san.AddIpAddress([System.Net.IPAddress]::Parse($_))
    $dashIp = $_.Replace(".", "-")
    $san.AddDnsName("pink-security.$dashIp.sslip.io")
}

$serverReq.CertificateExtensions.Add($san.Build())
$serverReq.CertificateExtensions.Add(
    [System.Security.Cryptography.X509Certificates.X509BasicConstraintsExtension]::new($true, $false, 0, $true)
)
$serverReq.CertificateExtensions.Add(
    [System.Security.Cryptography.X509Certificates.X509KeyUsageExtension]::new(
        (
            [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::DigitalSignature -bor
            [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::KeyEncipherment -bor
            [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::KeyCertSign -bor
            [System.Security.Cryptography.X509Certificates.X509KeyUsageFlags]::CrlSign
        ),
        $true
    )
)
$eku = [System.Security.Cryptography.OidCollection]::new()
$eku.Add([System.Security.Cryptography.Oid]::new("1.3.6.1.5.5.7.3.1")) | Out-Null
$serverReq.CertificateExtensions.Add(
    [System.Security.Cryptography.X509Certificates.X509EnhancedKeyUsageExtension]::new($eku, $true)
)

$serial = New-Object byte[] 16
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($serial)
$serverCert = $serverReq.CreateSelfSigned(
    [DateTimeOffset]::Now.AddDays(-1),
    [DateTimeOffset]::Now.AddDays(397)
)

$rootPem = ConvertTo-Pem "CERTIFICATE" $serverCert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
$serverPem = ConvertTo-Pem "CERTIFICATE" $serverCert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
$serverKeyPem = ConvertTo-Pem "PRIVATE KEY" $serverKey.Key.Export([System.Security.Cryptography.CngKeyBlobFormat]::Pkcs8PrivateBlob)

Set-Content -LiteralPath (Join-Path $certDir "pink-security-local-root-ca.pem") -Value $rootPem -Encoding ascii
[IO.File]::WriteAllBytes((Join-Path $certDir "pink-security-local-root-ca.cer"), $serverCert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert))
Set-Content -LiteralPath (Join-Path $certDir "pink-security-local-server.pem") -Value $serverPem -Encoding ascii
Set-Content -LiteralPath (Join-Path $certDir "pink-security-local-server-key.pem") -Value $serverKeyPem -Encoding ascii

Write-Output "Created local HTTPS certificates in $certDir"
Write-Output "Install/trust certs\\pink-security-local-root-ca.cer on your iPhone before using the HTTPS phone URL."
