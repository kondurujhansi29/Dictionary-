# Simple HTTP Server in PowerShell
$port = 8080
$folder = (Get-Item -Path ./).FullName

# Create HTTP listener
$http = [System.Net.HttpListener]::new()
$http.Prefixes.Add("http://localhost:$port/")
$http.Start()

Write-Host "Server started at http://localhost:$port"
Write-Host "Serving files from: $folder"
Write-Host "Press Ctrl+C to stop the server"

while ($http.IsListening) {
    $context = $http.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $path = $request.Url.LocalPath
    if ($path -eq "/") { $path = "/index.html" }
    
    $file = Join-Path $folder $path.TrimStart("/")
    
    if (Test-Path $file -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($file)
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
        Write-Host "[OK] GET $path"
    } else {
        $response.StatusCode = 404
        $response.ContentLength64 = 0
        Write-Host "[404] GET $path - Not Found"
    }
    
    $response.Close()
}
