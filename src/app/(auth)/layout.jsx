export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#0d0d12]">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] rounded-full bg-secondary/10 blur-[100px] animate-pulse" style={{ animationDuration: '5s' }} />
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  );
}
