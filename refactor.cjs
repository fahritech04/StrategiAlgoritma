const fs = require('fs');
const path = require('path');

const directories = [
  'src/pages',
  'src/pages/backtracking'
];

const filesToUpdate = [
  'Fibonacci.jsx', 'BinomialCoefficient.jsx', 'CoinRow.jsx', 'CoinChange.jsx', 'Knapsack.jsx', 'TSP.jsx',
  'BacktrackingIntro.jsx', 'NQueen.jsx', 'Hamiltonian.jsx', 'GraphColoring.jsx', 'SubsetSum.jsx'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Add Imports
  if (!content.includes('useAutoPlay')) {
    content = content.replace(
      "import CodeBlock from",
      "import useAutoPlay from '../../hooks/useAutoPlay';\nimport PlaybackControls from '../../components/PlaybackControls';\nimport ExecutionLog from '../../components/ExecutionLog';\nimport CodeBlock from"
    );
    // For pages directly in src/pages (not backtracking), adjust path
    if (filePath.includes('src\\pages\\') && !filePath.includes('backtracking')) {
      content = content.replace(/..\/..\/hooks/g, '../hooks').replace(/..\/..\/components/g, '../components');
    }
  }

  // Remove unused lucide-react icons
  content = content.replace(/import \{ Play, Pause, RotateCcw, SkipForward, SkipBack \} from 'lucide-react';\n/g, '');
  content = content.replace(/import \{ Play, Pause, RotateCcw, SkipForward, SkipBack, .*? \} from 'lucide-react';\n/g, function(match) {
      // If there are other icons, keep them
      return match.replace(/Play, Pause, RotateCcw, SkipForward, SkipBack, /g, '');
  });

  // 2. Replace useEffect timer with useAutoPlay
  // Find the useEffect that handles the timer. It usually contains `timer = setTimeout`
  const useEffectRegex = /useEffect\(\(\) => \{\s*let timer;\s*if\s*\(isPlaying.*?(?:800|900|1000|1200|1500)\);\s*\}\s*else\s*if.*?clearTimeout\(timer\);\s*\}, \[isPlaying, stepIdx, steps\.length\]\);/gs;
  
  // Extract delay to pass it to hook
  let delay = 1000;
  const delayMatch = content.match(/setTimeout\(\(\) => \{[\s\S]*?\}, (\d+)\);/);
  if (delayMatch) {
    delay = parseInt(delayMatch[1]);
  }

  content = content.replace(useEffectRegex, `useAutoPlay(isPlaying, setIsPlaying, stepIdx, setStepIdx, steps.length, ${delay});`);

  // Try matching simpler regex if the above didn't catch (some don't use 800-1500, or have slightly different spacing)
  const fallbackUseEffectRegex = /useEffect\(\(\) => \{\s*let timer;\s*if \(!*isPlaying[\s\S]*?clearTimeout\(timer\);\s*\}, \[isPlaying, stepIdx, steps\.length\]\);/gs;
  content = content.replace(fallbackUseEffectRegex, `useAutoPlay(isPlaying, setIsPlaying, stepIdx, setStepIdx, steps.length, ${delay});`);


  // 3. Replace controls
  const controlsRegex = /<div className="controls".*?<\/div>\s*<\/div>/gs; // Wait, last div closes controls. We must be careful not to consume extra divs
  const exactControlsRegex = /<div className="controls"[^>]*>[\s\S]*?<button[^>]*>[\s\S]*?SkipForward[\s\S]*?<\/button>\s*<\/div>/g;
  content = content.replace(exactControlsRegex, `<PlaybackControls isPlaying={isPlaying} setIsPlaying={setIsPlaying} stepIdx={stepIdx} setStepIdx={setStepIdx} stepsLength={steps.length} />`);

  // 4. Replace Execution Log
  const logRegex = /<div className="glass-panel">\s*<h3>Execution Log<\/h3>\s*<div className="log-panel"[^>]*>[\s\S]*?<div ref=\{\(el\) => el\?.scrollIntoView\(\{ behavior: 'smooth' \}\)\} \/>\s*<\/div>\s*<\/div>/g;
  content = content.replace(logRegex, `<ExecutionLog steps={steps} stepIdx={stepIdx} />`);

  // Another variant for Execution Log where ref is slightly different or not present
  const logRegex2 = /<div className="glass-panel">\s*<h3>Execution Log<\/h3>\s*<div className="log-panel"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g;
  if (!content.includes('<ExecutionLog')) {
     content = content.replace(logRegex2, `<ExecutionLog steps={steps} stepIdx={stepIdx} />`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`No changes made to ${filePath}`);
  }
}

directories.forEach(dir => {
  const fullDirPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullDirPath)) return;
  
  const files = fs.readdirSync(fullDirPath);
  files.forEach(file => {
    if (filesToUpdate.includes(file)) {
      processFile(path.join(fullDirPath, file));
    }
  });
});
