import React, { useState, useRef } from 'react';
import { Camera, MapPin, Activity, Droplet, AlertTriangle, CheckCircle, XCircle, BarChart2, Info } from 'lucide-react';
import MapComponent from './components/MapComponent';
import { saveReport, type ReportData } from './lib/waterReportService';

// --- Types ---
type StatusType = 'Safe' | 'Caution' | 'Unsafe';

interface Scan {
  id: number;
  location: string;
  turbidity: number;
  status: StatusType | string;
  date: string;
}

interface ScanResult {
  turbidity: string;
  ph: string;
  status: 'Safe' | 'Caution' | 'Unsafe';
  confidence: string;
}

// --- Helper Components ---

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false, ...props }: ButtonProps) => {
  const baseStyle = "px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "text-slate-500 hover:bg-slate-100",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-200"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Safe: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Caution: "bg-amber-100 text-amber-700 border-amber-200",
    Unsafe: "bg-rose-100 text-rose-700 border-rose-200",
  };
  const icons: Record<string, React.ReactNode> = {
    Safe: <CheckCircle size={14} />,
    Caution: <AlertTriangle size={14} />,
    Unsafe: <XCircle size={14} />,
  };

  const currentStyle = styles[status] || styles.Caution;
  const currentIcon = icons[status] || icons.Caution;

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${currentStyle}`}>
      {currentIcon} {status.toUpperCase()}
    </span>
  );
};

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userPoints, setUserPoints] = useState(120);
  const [scans, setScans] = useState<Scan[]>([
    { id: 1, location: "Village Well #4", turbidity: 2.1, status: "Safe", date: "2 hrs ago" },
    { id: 2, location: "River Bank North", turbidity: 45.3, status: "Unsafe", date: "5 hrs ago" },
    { id: 3, location: "Community Tank", turbidity: 8.5, status: "Caution", date: "1 day ago" },
  ]);

  // --- Image Analysis Logic ---
  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reporting Logic
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingStatus, setReportingStatus] = useState<'idle' | 'locating' | 'saving' | 'success' | 'error'>('idle');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
          setScanResult(null);
          setReportModalOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    if (!selectedImage) return;
    setAnalyzing(true);

    setTimeout(() => {
      const randomTurbidityVal = Math.random() * 60;
      const randomTurbidity = randomTurbidityVal.toFixed(1);
      let status: StatusType = "Safe";
      if (randomTurbidityVal > 5) status = "Caution";
      if (randomTurbidityVal > 20) status = "Unsafe";

      const result: ScanResult = {
        turbidity: randomTurbidity,
        ph: (6.5 + Math.random() * 1.5).toFixed(1),
        status: status,
        confidence: (85 + Math.random() * 14).toFixed(0) + "%"
      };

      setScanResult(result);
      setAnalyzing(false);

      // Trigger Logic: If unsafe, suggest reporting
      if (status === 'Unsafe' || status === 'Caution') {
        const shouldReport = window.confirm("Irregular water detected! Would you like to report this location to the community map?");
        if (shouldReport) {
          handleReportLocation(result);
        }
      }

      const newScan: Scan = {
        id: Date.now(),
        location: "Current Location",
        turbidity: parseFloat(result.turbidity),
        status: result.status,
        date: "Just now"
      };
      setScans([newScan, ...scans]);
      setUserPoints(prev => prev + 10);
    }, 2000);
  };

  const handleReportLocation = async (result: ScanResult) => {
    setReportModalOpen(true);
    setReportingStatus('locating');

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      setReportingStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      setReportingStatus('saving');
      try {
        const report: ReportData = {
          sourceName: "Water Source #" + Math.floor(Math.random() * 1000), // In real app, ask user for name
          status: result.status,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          turbidity: parseFloat(result.turbidity),
          reportedAt: new Date().toISOString()
        };

        await saveReport(report);
        setReportingStatus('success');

        // Auto switch to map after delay
        setTimeout(() => {
          setReportModalOpen(false);
          setActiveTab('map');
        }, 1500);

      } catch (e) {
        console.error(e);
        setReportingStatus('error');
      }
    }, (error) => {
      console.error("Geo error:", error);
      alert("Unable to retrieve your location for reporting.");
      setReportingStatus('error');
    });
  };

  // --- Views ---

  const renderHome = () => (
    <div className="space-y-6 pb-20 fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">Hello, Researcher</h2>
            <p className="text-blue-100 text-sm">Level 4 Contributor</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
            <Activity size={14} /> {userPoints} pts
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-2xl font-bold">{scans.length}</div>
            <div className="text-xs text-blue-100">Scans</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-2xl font-bold">98%</div>
            <div className="text-xs text-blue-100">Accuracy</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-blue-100">Unsafe</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveTab('scan')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 active:scale-95 transition-transform cursor-pointer hover:shadow-md"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Camera size={24} />
          </div>
          <span className="font-semibold text-slate-700">New Scan</span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 active:scale-95 transition-transform cursor-pointer hover:shadow-md"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            <MapPin size={24} />
          </div>
          <span className="font-semibold text-slate-700">Map View</span>
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-3 px-1">Recent Scans</h3>
        <div className="space-y-3">
          {scans.slice(0, 3).map((scan) => (
            <Card key={scan.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${scan.status === 'Safe' ? 'bg-emerald-100 text-emerald-600' : scan.status === 'Unsafe' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                  <Droplet size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{scan.location}</h4>
                  <p className="text-xs text-slate-500">{scan.date}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge status={scan.status} />
                <p className="text-xs text-slate-400 mt-1">{scan.turbidity} NTU</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScanner = () => (
    <div className="h-full flex flex-col pb-20 fade-in relative">
      {/* Report Status Modal Overlay */}
      {reportModalOpen && (
        <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm text-center border border-slate-100">
            {reportingStatus === 'locating' && (
              <>
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="font-bold text-lg mb-2">Acquiring GPS...</h3>
                <p className="text-slate-500 text-sm">Getting precise coordinates for the report.</p>
              </>
            )}
            {reportingStatus === 'saving' && (
              <>
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="font-bold text-lg mb-2">Saving to Map...</h3>
                <p className="text-slate-500 text-sm">Uploading data to community database.</p>
              </>
            )}
            {reportingStatus === 'success' && (
              <>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">Reported!</h3>
                <p className="text-slate-500 text-sm">Thank you. This source has been marked on the map.</p>
              </>
            )}
            {reportingStatus === 'error' && (
              <>
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">Failed</h3>
                <p className="text-slate-500 text-sm mb-4">Could not save location data.</p>
                <Button onClick={() => setReportModalOpen(false)} variant="outline">Close</Button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Water Analysis</h2>

        <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border-4 border-slate-100 shadow-inner group">
          {selectedImage ? (
            <>
              <img src={selectedImage} alt="Analysis Target" className="w-full h-full object-cover" />
              {analyzing && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="font-medium animate-pulse">Processing Turbidity...</p>
                  <p className="text-xs text-slate-300 mt-2">Checking Color Variance</p>
                </div>
              )}
            </>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="text-center p-6 cursor-pointer hover:bg-white/5 transition-colors w-full h-full flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                <Camera size={40} className="text-white" />
              </div>
              <p className="text-white font-medium">Tap to Take Photo</p>
              <p className="text-slate-400 text-sm mt-2 max-w-[200px]">Ensure water sample is against a solid background</p>
            </div>
          )}

          {!analyzing && selectedImage && !scanResult && (
            <div className="absolute inset-0 pointer-events-none opacity-50">
              <div className="w-full h-full border-2 border-blue-400/50 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/80 rounded-lg"></div>
                <div className="absolute top-4 right-4 text-xs text-white bg-black/40 px-2 py-1 rounded">AI Ready</div>
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {!scanResult ? (
          <div className="flex gap-3">
            {selectedImage ? (
              <>
                <Button variant="secondary" onClick={() => { setSelectedImage(null); setScanResult(null); }} className="flex-1">
                  Retake
                </Button>
                <Button onClick={analyzeImage} className="flex-1">
                  Analyze Sample
                </Button>
              </>
            ) : (
              <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                Open Camera
              </Button>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-5 border-t-4 border-t-blue-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 text-lg">Analysis Report</h3>
                <span className="text-xs text-slate-400">ID: #8823</span>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex-1">
                  <div className="text-sm text-slate-500 mb-1">Safety Status</div>
                  <Badge status={scanResult.status} />
                </div>
                <div className="flex-1 border-l pl-6">
                  <div className="text-sm text-slate-500 mb-1">Confidence</div>
                  <div className="font-bold text-slate-800">{scanResult.confidence}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Turbidity (NTU)</span>
                    <span className="font-bold text-slate-800">{scanResult.turbidity}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${scanResult.status === 'Safe' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min((parseFloat(scanResult.turbidity) / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {parseFloat(scanResult.turbidity) < 5 ? "Clear water detected." : "High particulate matter detected."}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Est. pH Level</span>
                    <span className="font-bold text-slate-800">{scanResult.ph}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${(parseFloat(scanResult.ph) / 14) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => { setSelectedImage(null); setScanResult(null); }} className="flex-1 py-2 text-sm">
                  Scan Another
                </Button>

                {/* Manual Trigger for Reporting if User Denied Auto-Prompt but changed mind */}
                <Button
                  className={`flex-1 py-2 text-sm ${scanResult.status === 'Safe' ? 'bg-emerald-600' : 'bg-blue-600'}`}
                  onClick={() => handleReportLocation(scanResult)}
                >
                  {scanResult.status === 'Safe' ? 'Save Result' : 'Report Location'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="h-full flex flex-col pb-20 fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 px-4 pt-4">Community Map</h2>
      <div className="flex-1 bg-slate-100 overflow-hidden border-y border-slate-200 relative">
        <MapComponent />
      </div>
    </div>
  );

  return (
    <div className="flex justify-center min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden relative flex flex-col h-[100dvh]">

        {/* Top Navigation / Branding */}
        <div className="bg-white border-b border-slate-100 p-4 pt-6 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Droplet size={20} fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Aqua<span className="text-blue-600">AI</span></h1>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer">
            <Info size={20} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-4 h-full">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'scan' && renderScanner()}
            {activeTab === 'map' && renderMap()}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center sticky bottom-0 z-40 safe-area-bottom">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BarChart2 size={24} />
            <span className="text-[10px] font-medium">Dashboard</span>
          </button>

          <div className="relative -top-6">
            <button
              onClick={() => {
                setActiveTab('scan');
                setSelectedImage(null);
                setScanResult(null);
              }}
              className="w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-200 text-white flex items-center justify-center hover:bg-blue-700 transition-transform active:scale-95 cursor-pointer"
            >
              <Camera size={28} />
            </button>
          </div>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${activeTab === 'map' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <MapPin size={24} />
            <span className="text-[10px] font-medium">Map</span>
          </button>
        </div>

      </div>
    </div>
  );
}
