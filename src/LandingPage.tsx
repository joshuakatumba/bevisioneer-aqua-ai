import {
    Droplet,
    ArrowRight,
    Map,
    DollarSign,
    AlertTriangle,
    CheckCircle,
    Zap,
    Twitter,
    Github
} from 'lucide-react';

interface LandingPageProps {
    onLaunch: () => void;
}

export default function LandingPage({ onLaunch }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <style>{`
        .glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .bg-movement {
          background-image: radial-gradient(circle at 2px 2px, #e2e8f0 1px, transparent 0);
          background-size: 40px 40px;
        }
        
        .hero-shape {
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
        }
        
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
      `}</style>

            <div className="bg-movement min-h-screen">
                {/* Navigation */}
                <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <Droplet size={24} fill="currentColor" />
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight">Aqua<span className="text-blue-600">AI</span></span>
                        </div>
                        <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600">
                            <a href="#problem" className="hover:text-blue-600 transition-colors">The Crisis</a>
                            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">Technology</a>
                            <a href="#movement" className="hover:text-blue-600 transition-colors">The Movement</a>
                        </div>
                        <button
                            onClick={onLaunch}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 cursor-pointer"
                        >
                            Launch App
                        </button>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-6">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                                JOIN THE MOVEMENT
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                                Clean Water is a <span className="gradient-text">Human Right,</span> Not a Luxury.
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                                AquaAI turns every smartphone into a professional water testing lab. Join thousands of contributors mapping the world's water quality in real-time.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={onLaunch}
                                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group cursor-pointer"
                                >
                                    Enter the Dashboard
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                    View Global Map
                                </button>
                            </div>
                            <div className="mt-10 flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    <img src="https://i.pravatar.cc/100?u=1" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                                    <img src="https://i.pravatar.cc/100?u=2" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                                    <img src="https://i.pravatar.cc/100?u=3" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                                </div>
                                <p className="text-sm text-slate-500">Join <span className="font-bold text-slate-900">12,400+</span> water advocates today</p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="hero-shape absolute inset-0 -z-10 animate-pulse"></div>
                            <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800" className="rounded-[2rem] shadow-inner" alt="Clean Water" />
                                {/* Overlay Mockup Card */}
                                <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl shadow-xl border border-white max-w-[240px] animate-bounce-slow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                            <CheckCircle size={18} />
                                        </div>
                                        <span className="font-bold text-slate-800">Sample Verified</span>
                                    </div>
                                    <p className="text-xs text-slate-500">Village Well #4: Turbidity 2.1 NTU (Safe for consumption)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problem Section */}
                <section id="problem" className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-8">The Invisible Crisis</h2>
                        <p className="text-xl text-slate-600 leading-relaxed mb-12">
                            Across the globe, water sources are failing. But the real danger isn't just the contamination—it's the <span className="text-blue-600 font-bold underline decoration-blue-200">silence.</span> Communities often drink from unsafe sources because they lack the expensive tools to test them.
                        </p>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle />
                                </div>
                                <h4 className="font-bold text-lg mb-2">Unseen Danger</h4>
                                <p className="text-sm text-slate-500">Contaminants are often invisible to the naked eye but deadly to health.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <DollarSign />
                                </div>
                                <h4 className="font-bold text-lg mb-2">High Cost</h4>
                                <p className="text-sm text-slate-500">Traditional lab tests cost hundreds of dollars and take weeks for results.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Map />
                                </div>
                                <h4 className="font-bold text-lg mb-2">Data Gaps</h4>
                                <p className="text-sm text-slate-500">Governments lack real-time maps of where water is failing right now.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section id="how-it-works" className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-extrabold mb-4">How AquaAI Empowers You</h2>
                            <p className="text-slate-500">Three steps to securing your community's future.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-12">
                            <div className="relative">
                                <div className="text-[120px] font-black text-blue-600/5 absolute -top-16 -left-4 select-none">01</div>
                                <h3 className="text-2xl font-bold mb-4 relative z-10">Capture</h3>
                                <p className="text-slate-600 relative z-10">Take a photo of a water sample against any solid background. Our AI analyzes turbidity, color variance, and particulate matter instantly.</p>
                            </div>
                            <div className="relative">
                                <div className="text-[120px] font-black text-blue-600/5 absolute -top-16 -left-4 select-none">02</div>
                                <h3 className="text-2xl font-bold mb-4 relative z-10">Analyze</h3>
                                <p className="text-slate-600 relative z-10">The neural network compares your sample against millions of verified data points to give you an immediate safety score and pH estimate.</p>
                            </div>
                            <div className="relative">
                                <div className="text-[120px] font-black text-blue-600/5 absolute -top-16 -left-4 select-none">03</div>
                                <h3 className="text-2xl font-bold mb-4 relative z-10">Empower</h3>
                                <p className="text-slate-600 relative z-10">Your data is automatically pinned to a global map, alerting others and pressuring authorities to take action in contaminated areas.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Movement Section */}
                <section id="movement" className="py-20 bg-blue-600 text-white overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <h2 className="text-4xl md:text-6xl font-extrabold mb-8">It's more than a project.<br />It's a <span className="text-cyan-300">National Movement.</span></h2>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12">
                            When you scan, you aren't just checking water. You are sounding an alarm. You are building a decentralized network of truth that protects every child and every family.
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={onLaunch}
                                className="bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-2xl active:scale-95 flex items-center gap-3 cursor-pointer"
                            >
                                <Zap fill="currentColor" />
                                CONTRIBUTIONS COMING SOON
                            </button>
                        </div>
                    </div>
                    {/* Decorative SVG */}
                    <svg className="absolute bottom-0 left-0 w-full opacity-10 pointer-events-none" viewBox="0 0 1440 320">
                        <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </section>

                {/* Footer */}
                <footer className="py-12 bg-slate-900 text-slate-400 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Droplet size={16} fill="currentColor" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">AquaAI</span>
                        </div>
                        <p className="text-sm">© 2025 AquaAI Global Movement. Dedicated to universal water safety.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors"><Twitter /></a>
                            <a href="#" className="hover:text-white transition-colors"><Github /></a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
