export type SourceCategory = 'university' | 'industry' | 'government' | 'startup' | 'github';

export interface ResearchSource {
  name: string;
  institution?: string;
  url: string;
  category: SourceCategory;
  focus: string[];
  region: 'NA' | 'EU' | 'ASIA' | 'GLOBAL';
}

export const GLOBAL_SOURCES: ResearchSource[] = [
  // =================================================================
  // 1. NORTH AMERICAN UNIVERSITIES (The Heavy Hitters)
  // =================================================================
  { name: "Stanford AI Lab", institution: "Stanford", url: "https://ai.stanford.edu", category: 'university', focus: ["ML", "AI"], region: 'NA' },
  { name: "Stanford HAI", institution: "Stanford", url: "https://hai.stanford.edu", category: 'university', focus: ["Human-AI"], region: 'NA' },
  { name: "Stanford Bio-X", institution: "Stanford", url: "https://biox.stanford.edu", category: 'university', focus: ["Biomedical"], region: 'NA' },
  { name: "SLAC Accelerator", institution: "Stanford", url: "https://www6.slac.stanford.edu", category: 'university', focus: ["Physics"], region: 'NA' },
  
  { name: "MIT CSAIL", institution: "MIT", url: "https://csail.mit.edu", category: 'university', focus: ["AI", "Robotics"], region: 'NA' },
  { name: "MIT Media Lab", institution: "MIT", url: "https://media.mit.edu", category: 'university', focus: ["Digital Media"], region: 'NA' },
  { name: "MIT Quest for Intelligence", institution: "MIT", url: "https://quest.mit.edu", category: 'university', focus: ["AI Foundations"], region: 'NA' },
  { name: "MIT Lincoln Lab", institution: "MIT", url: "https://www.ll.mit.edu", category: 'university', focus: ["Defense", "Cybersecurity"], region: 'NA' },

  { name: "Berkeley AI Research (BAIR)", institution: "UC Berkeley", url: "https://bair.berkeley.edu", category: 'university', focus: ["AI", "Robotics"], region: 'NA' },
  { name: "Berkeley RISE Lab", institution: "UC Berkeley", url: "https://rise.cs.berkeley.edu", category: 'university', focus: ["Systems"], region: 'NA' },
  { name: "Berkeley SkyDeck", institution: "UC Berkeley", url: "https://skydeck.berkeley.edu", category: 'university', focus: ["Startups"], region: 'NA' },

  { name: "CMU Robotics Institute", institution: "Carnegie Mellon", url: "https://www.ri.cmu.edu", category: 'university', focus: ["Robotics"], region: 'NA' },
  { name: "CMU Language Tech", institution: "Carnegie Mellon", url: "https://www.lti.cs.cmu.edu", category: 'university', focus: ["NLP", "Speech"], region: 'NA' },

  { name: "Harvard SEAS AI", institution: "Harvard", url: "https://cse-lab.seas.harvard.edu", category: 'university', focus: ["ML"], region: 'NA' },
  { name: "Harvard Data Science", institution: "Harvard", url: "https://datascience.harvard.edu", category: 'university', focus: ["Data Science"], region: 'NA' },

  { name: "Columbia Vision Lab", institution: "Columbia", url: "https://www1.cs.columbia.edu/CAVE/", category: 'university', focus: ["Computer Vision"], region: 'NA' },
  { name: "Yale AI Lab", institution: "Yale", url: "https://cpsc.yale.edu/research", category: 'university', focus: ["AI"], region: 'NA' },
  { name: "Princeton ML Group", institution: "Princeton", url: "https://www.cs.princeton.edu/research", category: 'university', focus: ["ML", "Optimization"], region: 'NA' },
  
  { name: "Caltech Neuroscience", institution: "Caltech", url: "https://neuroscience.caltech.edu", category: 'university', focus: ["Neuroscience"], region: 'NA' },
  { name: "Georgia Tech GVU", institution: "Georgia Tech", url: "https://www.gvu.gatech.edu", category: 'university', focus: ["HCI", "Graphics"], region: 'NA' },
  { name: "Purdue Quantum Lab", institution: "Purdue", url: "https://engineering.purdue.edu/QCL", category: 'university', focus: ["Quantum"], region: 'NA' },
  { name: "Vector Institute", institution: "U of Toronto", url: "https://www.vectorinstitute.ai", category: 'university', focus: ["AI"], region: 'NA' },

  // =================================================================
  // 2. INTERNATIONAL UNIVERSITIES (Asia & Europe)
  // =================================================================
  { name: "Tsinghua AIR", institution: "Tsinghua", url: "https://air.tsinghua.edu.cn/en/", category: 'university', focus: ["Industrial AI"], region: 'ASIA' },
  { name: "Tsinghua Brain & Cognition", institution: "Tsinghua", url: "https://brain.tsinghua.edu.cn/en/", category: 'university', focus: ["Cognitive AI"], region: 'ASIA' },
  { name: "Peking U CS", institution: "Peking U", url: "https://cs.pku.edu.cn", category: 'university', focus: ["CS Research"], region: 'ASIA' },
  { name: "NTU MARS Lab", institution: "NTU Singapore", url: "http://marslab.tech", category: 'university', focus: ["Robotics"], region: 'ASIA' },
  { name: "NUS Computing", institution: "NUS", url: "https://www.comp.nus.edu.sg", category: 'university', focus: ["Systems"], region: 'ASIA' },

  { name: "Cambridge Cavendish", institution: "Cambridge", url: "https://www.phy.cam.ac.uk", category: 'university', focus: ["Physics"], region: 'EU' },
  { name: "Oxford CS", institution: "Oxford", url: "https://www.cs.ox.ac.uk", category: 'university', focus: ["Verification", "AI"], region: 'EU' },
  { name: "ETH Zurich CS", institution: "ETH Zurich", url: "https://www.inf.ethz.ch", category: 'university', focus: ["Systems"], region: 'EU' },
  { name: "TUM CS", institution: "TU Munich", url: "https://www.cs.tum.de", category: 'university', focus: ["AI", "Systems"], region: 'EU' },

  // =================================================================
  // 3. TECH INDUSTRY GIANTS
  // =================================================================
  { name: "Google AI", url: "https://ai.google", category: 'industry', focus: ["Deep Learning"], region: 'NA' },
  { name: "DeepMind", url: "https://www.deepmind.com", category: 'industry', focus: ["AGI", "AlphaFold"], region: 'GLOBAL' },
  { name: "Microsoft Research", url: "https://www.microsoft.com/en-us/research/", category: 'industry', focus: ["General AI"], region: 'GLOBAL' },
  { name: "IBM Research", url: "https://www.research.ibm.com", category: 'industry', focus: ["Quantum"], region: 'NA' },
  { name: "Intel Labs", url: "https://www.intel.com/content/www/us/en/research/research-overview.html", category: 'industry', focus: ["Hardware"], region: 'NA' },
  { name: "NVIDIA Research", url: "https://www.nvidia.com/en-us/research/", category: 'industry', focus: ["GPU", "AI"], region: 'NA' },
  { name: "Meta AI (FAIR)", url: "https://ai.meta.com/research/", category: 'industry', focus: ["Vision", "LLMs"], region: 'NA' },
  { name: "OpenAI", url: "https://openai.com/research", category: 'industry', focus: ["LLMs", "AGI"], region: 'NA' },
  { name: "Anthropic", url: "https://www.anthropic.com/research", category: 'industry', focus: ["Safety"], region: 'NA' },

  // =================================================================
  // 4. CHINESE AI LABS
  // =================================================================
  { name: "DeepSeek", url: "https://www.deepseek.com", category: 'industry', focus: ["Reasoning", "LLMs"], region: 'ASIA' },
  { name: "Alibaba DAMO", url: "https://damo.alibaba.com", category: 'industry', focus: ["Enterprise AI"], region: 'ASIA' },
  { name: "Baidu Research", url: "https://www.baidu.com/research/ernie", category: 'industry', focus: ["Autonomous Driving"], region: 'ASIA' },
  { name: "Tencent AI", url: "https://ai.tencent.com", category: 'industry', focus: ["Multimodal"], region: 'ASIA' },
  { name: "Zhipu AI", url: "https://www.zhipuai.cn", category: 'industry', focus: ["GLM Models"], region: 'ASIA' },
  { name: "Moonshot AI", url: "https://www.moonshot.cn", category: 'industry', focus: ["Kimi Model"], region: 'ASIA' },

  // =================================================================
  // 5. GOVERNMENT & RESEARCH ORGS
  // =================================================================
  { name: "CERN LHC", url: "https://home.cern", category: 'government', focus: ["Particle Physics"], region: 'EU' },
  { name: "NASA JPL", url: "https://www.jpl.nasa.gov", category: 'government', focus: ["Space AI"], region: 'NA' },
  { name: "Lawrence Berkeley Lab", url: "https://newscenter.lbl.gov", category: 'government', focus: ["Materials"], region: 'NA' },
  { name: "Oak Ridge Lab", url: "https://www.ornl.gov", category: 'government', focus: ["HPC"], region: 'NA' },
  { name: "NOAA Ocean AI", url: "https://oceanobservatories.org", category: 'government', focus: ["Climate"], region: 'NA' },

  // =================================================================
  // 6. YC STARTUPS & GITHUB TRENDING
  // =================================================================
  { name: "Perplexity", url: "https://www.perplexity.ai/blog", category: 'startup', focus: ["Search"], region: 'NA' },
  { name: "LangChain", url: "https://blog.langchain.dev", category: 'startup', focus: ["Agents"], region: 'NA' },
  { name: "Hugging Face", url: "https://huggingface.co/blog", category: 'startup', focus: ["Open Source"], region: 'GLOBAL' },
  { name: "Mistral", url: "https://mistral.ai/news", category: 'startup', focus: ["LLMs"], region: 'EU' },
  { name: "AutoGPT Repo", url: "https://github.com/Significant-Gravitas/Auto-GPT", category: 'github', focus: ["Agents"], region: 'GLOBAL' },
  { name: "PyTorch Repo", url: "https://github.com/pytorch/pytorch", category: 'github', focus: ["Framework"], region: 'GLOBAL' },
  { name: "Vercel AI SDK", url: "https://sdk.vercel.ai", category: 'github', focus: ["Web AI"], region: 'NA' },
];
