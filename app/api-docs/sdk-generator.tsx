"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, Code, Package, FileText, Terminal } from "lucide-react"

export function SDKGenerator() {
  const [packageName, setPackageName] = useState("sureguard-ai-sdk")
  const [version, setVersion] = useState("1.0.0")
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")

  const generateSDK = (language: string) => {
    switch (language) {
      case "javascript":
        return {
          filename: "sureguard-ai.js",
          content: `// Sureguard AI JavaScript SDK v${version}
class SureguardAI {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || 'https://api.sureguard.ai/v1';
    this.timeout = options.timeout || 30000;
  }

  async analyze(input, type, options = {}) {
    const response = await this._request('POST', '/analyze', {
      input,
      type,
      options
    });
    return response;
  }

  async getThreats(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await this._request('GET', \`/threats?\${queryParams}\`);
    return response;
  }

  async analyzeDevice(deviceData) {
    const response = await this._request('POST', '/device/analyze', deviceData);
    return response;
  }

  async getAIInsights(options = {}) {
    const queryParams = new URLSearchParams(options).toString();
    const response = await this._request('GET', \`/ai/insights?\${queryParams}\`);
    return response;
  }

  async setupMonitoring(config) {
    const response = await this._request('POST', '/monitoring/realtime', config);
    return response;
  }

  async _request(method, endpoint, data = null) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const options = {
      method,
      headers: {
        'Authorization': \`Bearer \${this.apiKey}\`,
        'Content-Type': 'application/json',
        'User-Agent': 'SureguardAI-JS-SDK/${version}'
      },
      timeout: this.timeout
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(\`SureguardAI API Error: \${error.message}\`);
    }
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SureguardAI;
}
if (typeof window !== 'undefined') {
  window.SureguardAI = SureguardAI;
}

export default SureguardAI;`,
        }

      case "python":
        return {
          filename: "sureguard_ai.py",
          content: `"""
Sureguard AI Python SDK v${version}
"""
import requests
import json
from typing import Dict, Any, Optional, List
from urllib.parse import urlencode

class SureguardAI:
    def __init__(self, api_key: str, base_url: str = "https://api.sureguard.ai/v1", timeout: int = 30):
        self.api_key = api_key
        self.base_url = base_url
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'User-Agent': f'SureguardAI-Python-SDK/${version}'
        })

    def analyze(self, input_data: str, input_type: str, options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Analyze IP addresses, emails, devices, or domains for fraud risk."""
        payload = {
            'input': input_data,
            'type': input_type,
            'options': options or {}
        }
        return self._request('POST', '/analyze', payload)

    def get_threats(self, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Retrieve threat detections with filtering."""
        endpoint = '/threats'
        if filters:
            endpoint += f'?{urlencode(filters)}'
        return self._request('GET', endpoint)

    def analyze_device(self, device_data: Dict[str, Any]) -> Dict[str, Any]:
        """Advanced device fingerprinting and fraud detection."""
        return self._request('POST', '/device/analyze', device_data)

    def get_ai_insights(self, options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Get AI-powered insights and recommendations."""
        endpoint = '/ai/insights'
        if options:
            endpoint += f'?{urlencode(options)}'
        return self._request('GET', endpoint)

    def setup_monitoring(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Set up real-time monitoring."""
        return self._request('POST', '/monitoring/realtime', config)

    def _request(self, method: str, endpoint: str, data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Make HTTP request to the API."""
        url = f"{self.base_url}{endpoint}"
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, timeout=self.timeout)
            elif method.upper() == 'POST':
                response = self.session.post(url, json=data, timeout=self.timeout)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")

            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            raise Exception(f"SureguardAI API Error: {str(e)}")

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.session.close()

# Example usage
if __name__ == "__main__":
    client = SureguardAI("your-api-key")
    
    # Analyze an IP address
    result = client.analyze("192.168.1.100", "ip", {"ai_insights": True})
    print(json.dumps(result, indent=2))`,
        }

      case "php":
        return {
          filename: "SureguardAI.php",
          content: `<?php
/**
 * Sureguard AI PHP SDK v${version}
 */

class SureguardAI {
    private $apiKey;
    private $baseUrl;
    private $timeout;
    private $userAgent;

    public function __construct($apiKey, $options = []) {
        $this->apiKey = $apiKey;
        $this->baseUrl = $options['baseUrl'] ?? 'https://api.sureguard.ai/v1';
        $this->timeout = $options['timeout'] ?? 30;
        $this->userAgent = 'SureguardAI-PHP-SDK/${version}';
    }

    /**
     * Analyze IP addresses, emails, devices, or domains for fraud risk
     */
    public function analyze($input, $type, $options = []) {
        $data = [
            'input' => $input,
            'type' => $type,
            'options' => $options
        ];
        return $this->request('POST', '/analyze', $data);
    }

    /**
     * Retrieve threat detections with filtering
     */
    public function getThreats($filters = []) {
        $endpoint = '/threats';
        if (!empty($filters)) {
            $endpoint .= '?' . http_build_query($filters);
        }
        return $this->request('GET', $endpoint);
    }

    /**
     * Advanced device fingerprinting and fraud detection
     */
    public function analyzeDevice($deviceData) {
        return $this->request('POST', '/device/analyze', $deviceData);
    }

    /**
     * Get AI-powered insights and recommendations
     */
    public function getAIInsights($options = []) {
        $endpoint = '/ai/insights';
        if (!empty($options)) {
            $endpoint .= '?' . http_build_query($options);
        }
        return $this->request('GET', $endpoint);
    }

    /**
     * Set up real-time monitoring
     */
    public function setupMonitoring($config) {
        return $this->request('POST', '/monitoring/realtime', $config);
    }

    /**
     * Make HTTP request to the API
     */
    private function request($method, $endpoint, $data = null) {
        $url = $this->baseUrl . $endpoint;
        
        $headers = [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json',
            'User-Agent: ' . $this->userAgent
        ];

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_CUSTOMREQUEST => $method
        ]);

        if ($data !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new Exception("SureguardAI API Error: " . $error);
        }

        if ($httpCode >= 400) {
            throw new Exception("SureguardAI API Error: HTTP " . $httpCode);
        }

        $decoded = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("SureguardAI API Error: Invalid JSON response");
        }

        return $decoded;
    }
}

// Example usage
/*
$client = new SureguardAI('your-api-key');

// Analyze an IP address
$result = $client->analyze('192.168.1.100', 'ip', ['ai_insights' => true]);
echo json_encode($result, JSON_PRETTY_PRINT);
*/
?>`,
        }

      default:
        return { filename: "", content: "" }
    }
  }

  const downloadSDK = (language: string) => {
    const sdk = generateSDK(language)
    const blob = new Blob([sdk.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = sdk.filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>SDK Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Package Name</label>
              <Input
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="sureguard-ai-sdk"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Version</label>
              <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" />
            </div>
          </div>

          <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="php">PHP</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedLanguage} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{generateSDK(selectedLanguage).filename}</Badge>
                  <Badge variant="secondary">v{version}</Badge>
                </div>
                <Button onClick={() => downloadSDK(selectedLanguage)} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download SDK
                </Button>
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <ScrollArea className="h-96">
                  <pre className="text-green-400 text-sm">{generateSDK(selectedLanguage).content}</pre>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 border rounded-lg text-center">
              <Code className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold">Type Safe</h4>
              <p className="text-sm text-gray-600">Full TypeScript support with IntelliSense</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Terminal className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold">Easy Integration</h4>
              <p className="text-sm text-gray-600">Simple installation and setup process</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold">Well Documented</h4>
              <p className="text-sm text-gray-600">Comprehensive docs and examples</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
