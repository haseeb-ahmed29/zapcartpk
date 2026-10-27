import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wifi, WifiOff, Cloud, Volume2, Lightbulb, Smartphone, ShieldCheck, Power,
  AlertTriangle, Activity, Zap, ArrowLeft, Pause, Play, Bell, Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useGasSimulation } from "@/hooks/useGasSimulation";
import GasMeter from "@/components/iot/GasMeter";
import GasChart from "@/components/iot/GasChart";
import StatusCard from "@/components/iot/StatusCard";
import ComponentsGrid from "@/components/iot/ComponentsGrid";
import FlowDiagram from "@/components/iot/FlowDiagram";
import CircuitPreview from "@/components/iot/CircuitPreview";

// Performance optimization: Isolate 1-second clock state into a dedicated memoized component
// so that clock tick intervals do not trigger full re-renders of the IotDemo page tree.
const HeaderClock = memo(function HeaderClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass tabular-nums">
      <Activity className="w-3.5 h-3.5 neon-cyan" />
      <span>{now.toLocaleTimeString()}</span>
    </div>
  );
});

const IotDemo = () => {
  const sim = useGasSimulation();
  const [alertOpen, setAlertOpen] = useState(false);
  const lastNotifRef = useRef(0);

  // Trigger popup + toast when notification count increments (i.e. new danger event)
  useEffect(() => {
    if (sim.notificationCount > lastNotifRef.current) {
      lastNotifRef.current = sim.notificationCount;
      setAlertOpen(true);
      toast.error("📱 Mobile Alert: Gas Leakage Detected!", {
        description: `Gas level reached ${sim.gasLevel}% — Emergency response triggered.`,
      });
    }
  }, [sim.notificationCount, sim.gasLevel]);

  // Cycle the flowchart active step continuously when alarming
  const flowStep = useMemo(() => {
    if (sim.status === "danger") return Math.floor((sim.cloudPing / 2) % 5);
    return -1;
  }, [sim.cloudPing, sim.status]);

  const isDanger = sim.status === "danger";
  const isShutdown = sim.status === "shutdown";

  return (
    <div className="iot-theme relative">
      {isDanger && <div className="danger-overlay" />}

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Flame className="w-7 h-7 neon-cyan" />
                <div className="absolute inset-0 animate-pulse-glow" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">SafeSense IoT</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                  Gas Leak Detection & Alert System
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
              {sim.wifiConnected ? <Wifi className="w-3.5 h-3.5 neon-safe" /> : <WifiOff className="w-3.5 h-3.5 neon-danger" />}
              <span>{sim.wifiConnected ? "Wi-Fi Connected" : "Reconnecting"}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
              <Cloud className="w-3.5 h-3.5 neon-cyan animate-pulse-glow" />
              <span>Cloud Sync</span>
            </div>
            <HeaderClock />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Top status banner */}
        <div
          className={`glass p-4 flex items-center justify-between flex-wrap gap-3 ${
            isDanger ? "ring-danger animate-flash-danger" : isShutdown ? "" : "ring-safe"
          }`}
        >
          <div className="flex items-center gap-3">
            {isDanger ? (
              <AlertTriangle className="w-7 h-7 neon-danger animate-pulse-glow" />
            ) : isShutdown ? (
              <Power className="w-7 h-7 text-white/40" />
            ) : (
              <ShieldCheck className="w-7 h-7 neon-safe" />
            )}
            <div>
              <div className={`text-lg font-bold ${isDanger ? "neon-danger" : isShutdown ? "text-white/60" : "neon-safe"}`}>
                {isDanger ? "⚠ Gas Leakage Detected" : isShutdown ? "System Shutdown" : "Environment Safe"}
              </div>
              <div className="text-xs text-white/50">
                Last update: {new Date(sim.lastUpdate).toLocaleTimeString()} • Phase: {sim.phase}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!isShutdown && (
              <>
                <Button size="sm" variant="secondary" onClick={sim.togglePause}>
                  {sim.paused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
                  {sim.paused ? "Resume" : "Pause"}
                </Button>
                <Button size="sm" onClick={sim.triggerLeak} className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Flame className="w-4 h-4 mr-1" /> Trigger Leak
                </Button>
                <Button size="sm" variant="destructive" onClick={sim.emergencyShutdown}>
                  <Power className="w-4 h-4 mr-1" /> Emergency Shutdown
                </Button>
              </>
            )}
            {isShutdown && (
              <Button size="sm" onClick={sim.reset} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Zap className="w-4 h-4 mr-1" /> Reset System
              </Button>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Meter + Chart */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm uppercase tracking-widest text-white/70">Live Gas Reading</h2>
                <span className="text-[10px] text-white/40">MQ-2 Sensor • Real-time</span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <GasMeter value={sim.gasLevel} status={sim.status} threshold={sim.threshold} />
                <div className="flex-1 w-full space-y-3">
                  <Stat label="Digital Reading" value={`${sim.gasLevel} %LEL`} />
                  <Stat label="Sensor Voltage" value={`${(sim.rawGas * 0.05).toFixed(2)} V`} />
                  <Stat label="Air Quality" value={isDanger ? "HAZARDOUS" : sim.gasLevel > 30 ? "Moderate" : "Clean"} tone={isDanger ? "danger" : "safe"} />
                  <Stat label="System Health" value={isShutdown ? "Offline" : "Operational"} tone={isShutdown ? "muted" : "safe"} />
                </div>
              </div>
            </div>

            <div className="glass p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-sm uppercase tracking-widest text-white/70">Gas Level Trend</h2>
                <span className="text-[10px] text-white/40">Last {sim.history.length} readings</span>
              </div>
              <GasChart data={sim.history} threshold={sim.threshold} />
            </div>
          </div>

          {/* Right: Status indicators */}
          <div className="space-y-3">
            <StatusCard
              icon={Volume2}
              label="Buzzer"
              value={sim.buzzerOn ? "ALARM ON" : "Idle"}
              active={sim.buzzerOn}
              danger={sim.buzzerOn}
              animate="shake"
            />
            <StatusCard
              icon={Lightbulb}
              label="LED Indicator"
              value={sim.ledOn ? "Blinking" : "Off"}
              active={sim.ledOn}
              danger={sim.ledOn}
              animate="blink"
            />
            <StatusCard
              icon={Smartphone}
              label="Mobile Alerts"
              value={`${sim.notificationCount} sent`}
              active={sim.notificationCount > 0}
              animate="pulse"
            />
            <StatusCard
              icon={Cloud}
              label="Cloud Uplink"
              value={isShutdown ? "Offline" : "Streaming"}
              active={!isShutdown}
              animate="pulse"
            />
            <StatusCard
              icon={Bell}
              label="Auto Phase"
              value={sim.phase.toUpperCase()}
              active={!isShutdown}
            />
          </div>
        </div>

        {/* Components */}
        <section className="glass p-6">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-white/70 mb-4">Hardware Components</h2>
          <ComponentsGrid alarming={isDanger} />
        </section>

        {/* Flow + Circuit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="glass p-6">
            <h2 className="font-semibold text-sm uppercase tracking-widest text-white/70 mb-4">Working Flow</h2>
            <FlowDiagram activeStep={flowStep} />
          </section>
          <section className="glass p-6">
            <h2 className="font-semibold text-sm uppercase tracking-widest text-white/70 mb-4">Circuit Preview</h2>
            <CircuitPreview alarming={isDanger} />
            <div className="mt-3 text-[10px] text-white/40">
              Animated connection lines show data flow between MQ-2 → NodeMCU → Buzzer / LED / Wi-Fi.
            </div>
          </section>
        </div>

        <footer className="text-center text-xs text-white/40 py-4">
          SafeSense IoT • Smart Industrial Safety Monitoring System • Demo Simulation
        </footer>
      </main>

      {/* Emergency Popup */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="bg-black/90 border-red-500/50 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-6 h-6 animate-pulse-glow" /> EMERGENCY: Gas Leakage Detected
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              MQ-2 sensor detected gas concentration of <strong className="text-red-400">{sim.gasLevel}%</strong>,
              exceeding the safe threshold ({sim.threshold}%). Buzzer activated, LED blinking, and a mobile
              notification has been dispatched via Wi-Fi to registered devices.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600">Acknowledge</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

function Stat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "safe" | "danger" | "muted" }) {
  const cls = tone === "danger" ? "neon-danger" : tone === "safe" ? "neon-safe" : tone === "muted" ? "text-white/50" : "text-white";
  return (
    <div className="glass px-4 py-2 flex items-center justify-between">
      <span className="text-[11px] uppercase tracking-widest text-white/50">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${cls}`}>{value}</span>
    </div>
  );
}

export default IotDemo;
