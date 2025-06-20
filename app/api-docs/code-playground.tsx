"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Copy, CheckCircle, Terminal, Download } from "lucide-react"

interface CodePlaygroundProps {
  endpoint: {
    method: string
    path: string
    requestBody?: {
      example: string
    }
    response: {
      example: string
    }
  }
}

export function CodePlayground({ endpoint }: CodePlaygroundProps) {
  const [requestBody, setRequestBody] = useState(endpoint.requestBody?.example || "")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeLanguage, setActiveLanguage] = useState("javascript")

  const executeRequest = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setResponse(endpoint.response.example)
    } catch (error) {
      setResponse(JSON.stringify({ error: "Request failed" }, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateCode = (language: string) => {
    const baseUrl = "https://api.sureguard.ai"
    const fullUrl = `${baseUrl}${endpoint.path}`

    switch (language) {
      case "javascript":
        return `// JavaScript (fetch)
const response = await fetch('${fullUrl}', {
  method: '${endpoint.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },${
    endpoint.requestBody
      ? `
  body: JSON.stringify(${requestBody.replace(/\n/g, "").replace(/\s+/g, " ")}),`
      : ""
  }
});

const data = await response.json();
console.log(data);`

      case "python":
        return `# Python (requests)
import requests
import json

url = "${fullUrl}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}${
          endpoint.requestBody
            ? `
data = ${requestBody.replace(/\n/g, "").replace(/\s+/g, " ")}

response = requests.${endpoint.method.toLowerCase()}(url, headers=headers, json=data)`
            : `

response = requests.${endpoint.method.toLowerCase()}(url, headers=headers)`
        }
result = response.json()
print(json.dumps(result, indent=2))`

      case "curl":
        return `# cURL
curl -X ${endpoint.method} \\
  ${fullUrl} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type": "application/json" \\${
    endpoint.requestBody
      ? `
  -d '${requestBody.replace(/\n/g, "").replace(/\s+/g, " ")}'`
      : ""
  }`

      case "php":
        return `<?php
// PHP
$url = '${fullUrl}';
$headers = [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
];${
          endpoint.requestBody
            ? `
$data = '${requestBody.replace(/\n/g, "").replace(/\s+/g, " ")}';

$options = [
    'http' => [
        'header' => implode("\\r\\n", $headers),
        'method' => '${endpoint.method}',
        'content' => $data
    ]
];`
            : `

$options = [
    'http' => [
        'header' => implode("\\r\\n", $headers),
        'method' => '${endpoint.method}'
    ]
];`
        }

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$response = json_decode($result, true);

echo json_encode($response, JSON_PRETTY_PRINT);
?>`

      default:
        return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Terminal className="h-5 w-5" />
          <span>Interactive Code Playground</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeLanguage} onValueChange={setActiveLanguage} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="php">PHP</TabsTrigger>
          </TabsList>

          <TabsContent value={activeLanguage} className="space-y-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-white border-gray-600">
                  {activeLanguage.toUpperCase()}
                </Badge>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-white border-gray-600"
                    onClick={() => copyToClipboard(generateCode(activeLanguage))}
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline" className="text-white border-gray-600">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-64">
                <pre className="text-green-400 text-sm">{generateCode(activeLanguage)}</pre>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        {endpoint.requestBody && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Request Body (Editable)</label>
            <Textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
        )}

        <Button onClick={executeRequest} disabled={isLoading} className="w-full">
          {isLoading ? (
            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          {isLoading ? "Executing..." : "Execute Request"}
        </Button>

        {response && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Response</label>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-white border-gray-600">
                  JSON Response
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-white border-gray-600"
                  onClick={() => copyToClipboard(response)}
                >
                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <ScrollArea className="h-64">
                <pre className="text-green-400 text-sm">{response}</pre>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
