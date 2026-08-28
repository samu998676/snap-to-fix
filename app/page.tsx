'use client';

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react';

type DiagnosticKey = 'washer' | 'dashboard' | 'valve';
type Stage = 'idle' | 'preview' | 'analyzing' | 'result';

const diagnostics: Record<DiagnosticKey, {
  label: string;
  device: string;
  code: string;
  confidence: number;
  title: string;
  risk: 'Safe DIY' | 'Caution';
  time: string;
  tools: string;
  summary: string;
  evidence: string;
  warning: string;
  steps: string[];
}> = {
  washer: {
    label: 'Washer E21',
    device: 'Front-load washer family',
    code: 'E21',
    confidence: 98,
    title: 'Drain filter blockage',
    risk: 'Safe DIY',
    time: '20 min',
    tools: 'Towel + tray',
    summary: 'The washer is taking too long to drain. A blocked pump filter is the most likely cause.',
    evidence: 'The E21 display and standing water pattern match a restricted drain path.',
    warning: 'Unplug the washer before opening the filter. Expect residual water and keep the plug dry.',
    steps: [
      'Switch the washer off, unplug it, and wait 2 minutes.',
      'Place a low tray and towel beneath the lower service flap.',
      'If the official manual shows a user-accessible pump filter, drain it slowly and remove visible debris.',
      'Reseat the filter firmly, restore power, and run a short rinse cycle.',
    ],
  },
  dashboard: {
    label: 'Dashboard light',
    device: 'Passenger vehicle',
    code: 'TPMS',
    confidence: 94,
    title: 'Low tire pressure warning',
    risk: 'Caution',
    time: '10 min',
    tools: 'Tire gauge',
    summary: 'One or more tires may be below the manufacturer’s recommended cold pressure.',
    evidence: 'The horseshoe-shaped amber symbol with an exclamation mark matches the TPMS warning.',
    warning: 'Pull over safely before inspecting. Do not continue driving on a visibly flat or damaged tire.',
    steps: [
      'Park on level ground away from traffic and let the tires cool.',
      'Check every tire with a gauge, including any tire that looks normal.',
      'Inflate to the pressure on the driver-door placard—not the tire sidewall maximum.',
      'If the light stays on or pressure drops again, stop and arrange tire service.',
    ],
  },
  valve: {
    label: 'Cracked valve',
    device: 'Plastic shutoff valve',
    code: 'VISUAL',
    confidence: 91,
    title: 'Stress crack at valve body',
    risk: 'Caution',
    time: '30–45 min',
    tools: 'Wrench + bucket',
    summary: 'The visible fracture can spread under pressure and should not be patched as a permanent repair.',
    evidence: 'A branching line at the threaded joint is consistent with an overtightened or aged valve body.',
    warning: 'Shut off the upstream water supply first. If this is a gas or fuel line, do not touch it—leave the area and call a professional.',
    steps: [
      'Confirm the line carries only water, then close the upstream shutoff.',
      'Open a nearby tap to release pressure and place a bucket below.',
      'Replace the entire valve with a correctly rated part; do not glue the crack.',
      'Restore pressure slowly and watch the joint for several minutes.',
    ],
  },
};

const examples = Object.entries(diagnostics) as [DiagnosticKey, (typeof diagnostics)[DiagnosticKey]][];
const analysisMessages = ['Reading visible clues', 'Matching device patterns', 'Building the safest next steps'];

export default function Home() {
  const [stage, setStage] = useState<Stage>('idle');
  const [activeKey, setActiveKey] = useState<DiagnosticKey>('washer');
  const [analysisStep, setAnalysisStep] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [escalation, setEscalation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<number[]>([]);
  const result = diagnostics[activeKey];

  useEffect(() => () => timersRef.current.forEach(window.clearTimeout), []);

  function clearTimers() {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];
  }

  function resetDemo() {
    clearTimers();
    setStage('idle');
    setImageUrl(null);
    setFileName('');
    setFileError('');
    setShowAllSteps(false);
    setEscalation(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function acceptFile(file?: File) {
    if (!file) return;
    setFileError('');
    if (!file.type.startsWith('image/')) {
      setFileError('Please choose a JPG, PNG, HEIC, or another image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError('That photo is over 10 MB. Choose a smaller image and try again.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(String(reader.result));
      setFileName(file.name);
      setStage('preview');
      setEscalation(false);
    };
    reader.onerror = () => setFileError('We could not read that photo. Please try another one.');
    reader.readAsDataURL(file);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    acceptFile(event.target.files?.[0]);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  }

  function runAnalysis(key: DiagnosticKey) {
    clearTimers();
    setActiveKey(key);
    setAnalysisStep(0);
    setShowAllSteps(false);
    setEscalation(false);
    setStage('analyzing');
    timersRef.current = [
      window.setTimeout(() => setAnalysisStep(1), 520),
      window.setTimeout(() => setAnalysisStep(2), 1050),
      window.setTimeout(() => setStage('result'), 1650),
    ];
  }

  function focusDemo() {
    resetDemo();
    document.getElementById('diagnose')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Snap-to-Fix home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>Snap-to-Fix</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#watch-demo">Watch demo</a>
          <a href="#use-cases">What it solves</a>
          <a href="#safety">Safety first</a>
        </nav>
        <a className="header-cta" href="#diagnose">Try the demo <span>↗</span></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> Your pocket repair expert</div>
          <h1>See the problem.<br /><em>Know the fix.</em></h1>
          <p className="hero-dek">
            Snap a photo of an error code, warning light, or broken part.
            Get a clear diagnosis and a safe, step-by-step path forward.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#diagnose">Diagnose something <span>↓</span></a>
            <a className="text-link" href="#watch-demo">Watch the walkthrough <span>→</span></a>
          </div>
          <div className="trust-row">
            <div className="trust-proof"><strong>30 sec</strong><span>to first answer</span></div>
            <div className="trust-proof"><strong>Safety-led</strong><span>every step</span></div>
            <div className="trust-proof"><strong>Plain English</strong><span>zero manual digging</span></div>
          </div>
        </div>

        <div className={`diagnostic-shell ${stage === 'result' ? 'has-result' : ''}`} id="diagnose">
          <div className="shell-topline">
            <span className={`status-dot ${stage === 'analyzing' ? 'working' : ''}`} />
            <span>{stage === 'result' ? 'DIAGNOSIS COMPLETE' : stage === 'analyzing' ? 'ANALYSIS IN PROGRESS' : 'PRODUCT DEMO READY'}</span>
            <span className="demo-pill">INTERACTIVE DEMO</span>
          </div>

          <div className="shell-content" aria-live="polite">
            {stage === 'idle' && (
              <>
                <div
                  className={`upload-panel ${dragging ? 'is-dragging' : ''}`}
                  onDragEnter={() => setDragging(true)}
                  onDragLeave={() => setDragging(false)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={onDrop}
                >
                  <div className="camera-icon" aria-hidden="true"><span /></div>
                  <h2>What needs fixing?</h2>
                  <p>Take a clear photo or choose one from your device.</p>
                  <button type="button" className="photo-button" onClick={() => fileInputRef.current?.click()}>
                    ＋ &nbsp; Add a photo
                  </button>
                  <input ref={fileInputRef} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/heic,image/webp" onChange={onFileChange} aria-label="Choose a photo to diagnose" />
                  <span className="format-note">JPG, PNG, HEIC OR WEBP · MAX 10 MB · KEEP FACES &amp; PERSONAL DETAILS OUT OF FRAME</span>
                  {fileError && <p className="file-error" role="alert">{fileError}</p>}
                </div>
                <div className="example-row">
                  <span>OR TRY AN EXAMPLE</span>
                  <div>
                    {examples.map(([key, item]) => (
                      <button key={key} type="button" onClick={() => runAnalysis(key)}>{item.label}</button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {stage === 'preview' && imageUrl && (
              <div className="preview-state">
                <div className="photo-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt={`Selected diagnostic photo: ${fileName}`} />
                  <button type="button" onClick={resetDemo}>Replace photo</button>
                </div>
                <div className="preview-copy">
                  <span className="state-kicker">PHOTO READY</span>
                  <h2>One quick detail</h2>
                  <p>What kind of equipment is in the photo? This lets the demo show the most relevant diagnostic path.</p>
                  <div className="category-buttons" aria-label="Choose equipment category">
                    <button type="button" onClick={() => runAnalysis('washer')}>Home appliance</button>
                    <button type="button" onClick={() => runAnalysis('dashboard')}>Vehicle warning</button>
                    <button type="button" onClick={() => runAnalysis('valve')}>Tool or part</button>
                  </div>
                  <span className="privacy-note">Your selected image stays in this browser demo and is not uploaded.</span>
                </div>
              </div>
            )}

            {stage === 'analyzing' && (
              <div className="analysis-state">
                <div className="scan-visual" aria-hidden="true">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt="" />
                  ) : (
                    <div className={`demo-object ${activeKey}`}><span>{result.code}</span></div>
                  )}
                  <i />
                  <b className="corner c1" /><b className="corner c2" /><b className="corner c3" /><b className="corner c4" />
                </div>
                <div className="analysis-copy">
                  <span className="state-kicker">ANALYZING CLUES</span>
                  <h2>{analysisMessages[analysisStep]}…</h2>
                  <div className="progress-track"><span style={{ width: `${(analysisStep + 1) * 33.34}%` }} /></div>
                  <ol className="analysis-list">
                    {analysisMessages.map((message, index) => (
                      <li key={message} className={index <= analysisStep ? 'done' : ''}>
                        <span>{index < analysisStep ? '✓' : index + 1}</span>{message}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {stage === 'result' && (
              <div className="diagnosis-result">
                <div className="result-summary">
                <div className="confidence-ring"><strong>{result.confidence}%</strong><span>demo match</span></div>
                  <div>
                    <span className="state-kicker">{result.device} · {result.code}</span>
                    <h2>{result.title}</h2>
                    <p>{result.summary}</p>
                  </div>
                </div>
                <div className={`safety-alert ${result.risk === 'Caution' ? 'caution' : ''}`}>
                  <span className="safety-symbol" aria-hidden="true">!</span>
                  <div><strong>{result.risk}</strong><p>{result.warning}</p></div>
                </div>
                <div className="result-facts">
                  <div><span>EST. TIME</span><strong>{result.time}</strong></div>
                  <div><span>TOOLS</span><strong>{result.tools}</strong></div>
                  <div><span>WHY THIS MATCH</span><strong>{result.evidence}</strong></div>
                </div>
                <div className="fix-plan">
                  <div className="fix-plan-title"><span>RECOMMENDED FIX</span><strong>Step-by-step</strong></div>
                  <ol>
                    {result.steps.slice(0, showAllSteps ? result.steps.length : 2).map((step, index) => (
                      <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>
                    ))}
                  </ol>
                  {!showAllSteps && <button className="show-steps" type="button" onClick={() => setShowAllSteps(true)}>Show the final 2 steps <span>↓</span></button>}
                </div>
                <p className="result-disclaimer">Sample diagnosis for demonstration. Confirm the exact model and follow its official manual before performing any step.</p>
                {escalation ? (
                  <div className="escalation-note" role="status">
                    <strong>Bring in a professional.</strong>
                    <p>Stop here and share the device type, visible code ({result.code}), and what you already checked. For immediate hazards, move to safety first.</p>
                  </div>
                ) : (
                  <div className="result-actions">
                    <button type="button" className="photo-button compact" onClick={resetDemo}>Start a new check</button>
                    <button type="button" className="secondary-button" onClick={() => setEscalation(true)}>I’d rather call a pro</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {stage === 'idle' && (
          <aside className="result-peek" aria-label="Example diagnosis">
            <div className="result-head"><span className="match-score">98%</span><span>VISUAL MATCH</span></div>
            <div className="appliance-visual" aria-hidden="true">
              <div className="washer-door"><span /></div><span className="error-code">E21</span>
            </div>
            <div className="result-body">
              <span className="severity">SAFE DIY · 20 MIN</span>
              <h3>Drain filter blockage</h3>
              <p>The error code and standing water point to a blocked pump filter.</p>
              <span className="solution-link">4-step fix ready <b>→</b></span>
            </div>
          </aside>
        )}
      </section>

      <section className="signal-strip" aria-label="Supported categories">
        <span>HOME APPLIANCES</span><i /><span>CAR WARNINGS</span><i /><span>TOOLS &amp; PARTS</span><i /><span>HEATING &amp; COOLING</span>
      </section>

      <section className="intro" id="how-it-works">
        <div>
          <span className="section-number">01 — HOW IT WORKS</span>
          <h2>From “what’s that?”<br />to “I’ve got this.”</h2>
        </div>
        <p>Snap-to-Fix turns confusing hardware problems into plain-English answers—so you can make the next move with confidence.</p>
      </section>

      <section className="demo-video-section" id="watch-demo" aria-labelledby="watch-demo-title">
        <div className="demo-video-head">
          <div>
            <span className="section-number">WATCH THE WALKTHROUGH</span>
            <h2 id="watch-demo-title">See Snap-to-Fix<br />in 48 seconds.</h2>
            <p id="watch-demo-summary">From a confusing warning to a clear, safety-led next step—shown from start to finish.</p>
          </div>
          <div className="demo-video-actions">
            <span>1920 × 1080 · CAPTIONS INCLUDED</span>
            <a href="./snap-to-fix-demo.mp4?v=2" download="Snap-to-Fix-Demo-1080p-v2.mp4">Download HD demo <b>↓</b></a>
          </div>
        </div>

        <div className="demo-video-frame">
          <video
            controls
            playsInline
            preload="metadata"
            poster="./snap-to-fix-demo-poster.png?v=2"
            aria-labelledby="watch-demo-title"
            aria-describedby="watch-demo-summary"
          >
            <source src="./snap-to-fix-demo.mp4?v=2" type="video/mp4" />
            <p>Your browser cannot play this video. <a href="./snap-to-fix-demo.mp4?v=2">Download it instead.</a></p>
          </video>
          <div className="demo-video-meta" aria-hidden="true">
            <span>01 · SNAP THE CLUE</span><i /><span>02 · UNDERSTAND IT</span><i /><span>03 · TAKE THE SAFE STEP</span>
          </div>
        </div>

        <details className="demo-transcript">
          <summary>Read the video transcript <span>＋</span></summary>
          <div>
            <p>When an appliance flashes a code, a dashboard light appears, or a part cracks, the real problem is uncertainty. What is it? Is it safe? And what should you do next?</p>
            <p>Snap-to-Fix turns that moment into a clear path forward. Take a photo, or choose a visible clue. The app identifies the device, explains the likely issue in plain English, and puts the safety warning first.</p>
            <p>Then it gives you simple checks, the tools you’ll need, and step-by-step guidance. If the risk is too high, it tells you to stop and call a professional. Less guessing. Faster decisions. Safer repairs.</p>
          </div>
        </details>
      </section>

      <section className="steps-section" aria-label="How Snap-to-Fix works">
        <article><span className="step-index">01</span><div className="step-icon focus-icon" aria-hidden="true"><i /></div><h3>Snap the clue</h3><p>Capture the code, warning light, leak, sound source, or damaged part from a clear angle.</p></article>
        <article><span className="step-index">02</span><div className="step-icon scan-icon" aria-hidden="true"><i /></div><h3>Understand the issue</h3><p>Visual details are matched against device patterns and translated into a likely cause—with uncertainty shown.</p></article>
        <article><span className="step-index">03</span><div className="step-icon path-icon" aria-hidden="true"><i /></div><h3>Take the safe next step</h3><p>Follow a practical fix, gather one more clue, or stop and call the right professional.</p></article>
      </section>

      <section className="use-cases" id="use-cases">
        <div className="use-cases-head">
          <span className="section-number light">02 — ONE TOOL, MANY FIXES</span>
          <h2>Built for the moment<br />between confusion<br />and a service call.</h2>
        </div>
        <div className="case-grid">
          <article className="case-card case-large">
            <div className="case-art error-art" aria-hidden="true"><span>E21</span><i /><b /></div>
            <span>APPLIANCES</span><h3>Decode the display</h3><p>Translate error codes and indicator patterns into the checks that actually matter.</p>
          </article>
          <article className="case-card">
            <div className="case-art dashboard-art" aria-hidden="true"><span>!</span><i /><b /></div>
            <span>VEHICLES</span><h3>Read the warning</h3><p>Know what can wait, what needs attention, and what means stop driving.</p>
          </article>
          <article className="case-card">
            <div className="case-art part-art" aria-hidden="true"><i /><b /></div>
            <span>PARTS &amp; HARDWARE</span><h3>Name the broken thing</h3><p>Identify a component, understand the damage, and buy the right replacement.</p>
          </article>
        </div>
      </section>

      <section className="safety-section" id="safety">
        <div className="safety-copy">
          <span className="section-number">03 — SAFETY, NOT BRAVADO</span>
          <h2>Some fixes should<br />never be DIY.</h2>
          <p>Snap-to-Fix puts the stop signal before the instructions. When a photo suggests gas, fire, high voltage, pressure, structural risk, or critical vehicle systems, the safest answer is escalation.</p>
          <div className="safety-rule"><span>!</span><p><strong>Immediate danger?</strong> Move away from the hazard and contact local emergency services or the appropriate utility.</p></div>
        </div>
        <div className="risk-ladder" aria-label="Snap-to-Fix risk levels">
          <div className="risk safe"><span>01</span><div><strong>Safe DIY</strong><p>Clear shutoff step, common tools, reversible work.</p></div><b>GO</b></div>
          <div className="risk check"><span>02</span><div><strong>Proceed with caution</strong><p>Extra checks or protective equipment required.</p></div><b>CHECK</b></div>
          <div className="risk stop"><span>03</span><div><strong>Stop &amp; call a pro</strong><p>Gas, live power, pressure, fire, brakes, or uncertainty.</p></div><b>STOP</b></div>
        </div>
      </section>

      <section className="final-cta">
        <span className="section-number light">READY WHEN SOMETHING ISN’T</span>
        <h2>Don’t guess.<br /><em>Snap it.</em></h2>
        <button type="button" onClick={focusDemo}>Try the interactive demo <span>↗</span></button>
        <p>No account needed · Your photo stays on your device in this prototype</p>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true"><span /></span><span>Snap-to-Fix</span></a>
        <p>Photo-powered clarity for everyday repairs.</p>
        <p className="prototype-note">Interactive concept prototype · Guidance is illustrative, not a substitute for a qualified technician.</p>
      </footer>
    </main>
  );
}
