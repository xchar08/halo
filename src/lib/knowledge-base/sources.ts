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

// =================================================================
// MEDICAL UNIVERSITIES & RESEARCH CENTERS - NORTH AMERICA
// =================================================================
{ name: "Harvard Medical School", institution: "Harvard", url: "https://hms.harvard.edu/research", category: 'university', focus: ["Clinical Research", "Biomedical"], region: 'NA' },
{ name: "Johns Hopkins Medicine", institution: "Johns Hopkins", url: "https://www.hopkinsmedicine.org/research", category: 'university', focus: ["Neuroscience", "Cancer"], region: 'NA' },
{ name: "Stanford Medicine", institution: "Stanford", url: "https://med.stanford.edu/research.html", category: 'university', focus: ["Precision Health", "Genomics"], region: 'NA' },
{ name: "UCSF Medical Center", institution: "UC San Francisco", url: "https://www.ucsf.edu/research", category: 'university', focus: ["Neurology", "Immunology"], region: 'NA' },
{ name: "Mayo Clinic Research", institution: "Mayo Clinic", url: "https://www.mayo.edu/research", category: 'university', focus: ["Regenerative Medicine", "Clinical Trials"], region: 'NA' },
{ name: "Cleveland Clinic Lerner", institution: "Cleveland Clinic", url: "https://www.lerner.ccf.org", category: 'university', focus: ["Cardiovascular", "Cancer"], region: 'NA' },
{ name: "Penn Medicine", institution: "UPenn", url: "https://www.pennmedicine.org/research", category: 'university', focus: ["Gene Therapy", "Cancer"], region: 'NA' },
{ name: "UCSF Helen Diller Cancer Center", institution: "UCSF", url: "https://cancer.ucsf.edu", category: 'university', focus: ["Oncology"], region: 'NA' },
{ name: "Duke Health Research", institution: "Duke", url: "https://research.duke.edu/health-medicine", category: 'university', focus: ["Clinical Trials", "Genomics"], region: 'NA' },
{ name: "Washington U Medicine", institution: "WashU", url: "https://medicine.wustl.edu/research/", category: 'university', focus: ["Neuroscience", "Diabetes"], region: 'NA' },
{ name: "Columbia Medical Center", institution: "Columbia", url: "https://www.cuimc.columbia.edu/research", category: 'university', focus: ["Cardiology", "Cancer"], region: 'NA' },
{ name: "Yale School of Medicine", institution: "Yale", url: "https://medicine.yale.edu/research/", category: 'university', focus: ["Immunobiology", "Cancer"], region: 'NA' },
{ name: "Northwestern Medicine", institution: "Northwestern", url: "https://www.feinberg.northwestern.edu/research/", category: 'university', focus: ["Neurology", "Cardiology"], region: 'NA' },
{ name: "Vanderbilt Medical Center", institution: "Vanderbilt", url: "https://www.vumc.org/research/", category: 'university', focus: ["Precision Medicine"], region: 'NA' },
{ name: "Baylor College of Medicine", institution: "Baylor", url: "https://www.bcm.edu/research", category: 'university', focus: ["Genetics", "Neuroscience"], region: 'NA' },
{ name: "UCSD Health Sciences", institution: "UC San Diego", url: "https://health.ucsd.edu/research", category: 'university', focus: ["Stem Cells", "Immunology"], region: 'NA' },
{ name: "UCLA Health Research", institution: "UCLA", url: "https://www.uclahealth.org/research", category: 'university', focus: ["Cancer", "Neuroscience"], region: 'NA' },
{ name: "UW Medicine Research", institution: "U Washington", url: "https://www.uwmedicine.org/research", category: 'university', focus: ["Global Health", "Infectious Disease"], region: 'NA' },
{ name: "U Michigan Medicine", institution: "Michigan", url: "https://research.medicine.umich.edu", category: 'university', focus: ["Precision Health"], region: 'NA' },
{ name: "Emory Health Sciences", institution: "Emory", url: "https://www.emoryhealthsciences.org/research/", category: 'university', focus: ["Infectious Disease", "Vaccines"], region: 'NA' },
{ name: "U Toronto Medicine", institution: "U Toronto", url: "https://medicine.utoronto.ca/research", category: 'university', focus: ["Regenerative Medicine"], region: 'NA' },

// NCI-DESIGNATED CANCER CENTERS (Top Tier)
{ name: "MD Anderson Cancer Center", institution: "UT MD Anderson", url: "https://www.mdanderson.org/research.html", category: 'university', focus: ["Oncology", "Cancer"], region: 'NA' },
{ name: "Memorial Sloan Kettering", institution: "MSK", url: "https://www.mskcc.org/research", category: 'university', focus: ["Cancer", "Immunotherapy"], region: 'NA' },
{ name: "Dana-Farber Cancer Institute", institution: "Harvard", url: "https://www.dana-farber.org/research/", category: 'university', focus: ["Cancer", "Genomics"], region: 'NA' },
{ name: "Fred Hutchinson Cancer Center", institution: "Fred Hutch", url: "https://www.fredhutch.org/en/research.html", category: 'university', focus: ["Cancer", "Immunotherapy"], region: 'NA' },
{ name: "Roswell Park Cancer Institute", institution: "Roswell Park", url: "https://www.roswellpark.org/research", category: 'university', focus: ["Oncology"], region: 'NA' },

// =================================================================
// MEDICAL UNIVERSITIES & RESEARCH CENTERS - INTERNATIONAL
// =================================================================
{ name: "Karolinska Institutet", institution: "Karolinska", url: "https://ki.se/en/research", category: 'university', focus: ["Neuroscience", "Immunology", "Cancer"], region: 'EU' },
{ name: "Oxford Medical Sciences", institution: "Oxford", url: "https://www.medsci.ox.ac.uk/research", category: 'university', focus: ["Vaccines", "Clinical Trials"], region: 'EU' },
{ name: "Cambridge Medicine", institution: "Cambridge", url: "https://www.cam.ac.uk/research/research-at-cambridge/medicine", category: 'university', focus: ["Cancer", "Genomics"], region: 'EU' },
{ name: "Imperial College Medicine", institution: "Imperial", url: "https://www.imperial.ac.uk/medicine/research/", category: 'university', focus: ["Infectious Disease"], region: 'EU' },
{ name: "UCL Medical School", institution: "UCL", url: "https://www.ucl.ac.uk/medical-school/research", category: 'university', focus: ["Neuroscience", "Cancer"], region: 'EU' },
{ name: "Charité Berlin", institution: "Charité", url: "https://www.charite.de/en/research/", category: 'university', focus: ["Neurology", "Immunology"], region: 'EU' },
{ name: "Singapore General Hospital", institution: "SGH", url: "https://www.sgh.com.sg/research-innovation/", category: 'university', focus: ["Clinical Trials", "CART-T", "AI"], region: 'ASIA' },
{ name: "National University Hospital Singapore", institution: "NUS", url: "https://www.nuh.com.sg/research", category: 'university', focus: ["Cancer", "Precision Medicine"], region: 'ASIA' },
{ name: "U Tokyo Medicine", institution: "U Tokyo", url: "https://www.u-tokyo.ac.jp/en/research/", category: 'university', focus: ["Regenerative Medicine"], region: 'ASIA' },

// =================================================================
// NIH INSTITUTES & CENTERS
// =================================================================
{ name: "National Cancer Institute", institution: "NIH", url: "https://www.cancer.gov", category: 'government', focus: ["Cancer Research"], region: 'NA' },
{ name: "NIAID", institution: "NIH", url: "https://www.niaid.nih.gov", category: 'government', focus: ["Infectious Disease", "Immunology"], region: 'NA' },
{ name: "NIMH", institution: "NIH", url: "https://www.nimh.nih.gov", category: 'government', focus: ["Mental Health"], region: 'NA' },
{ name: "NINDS", institution: "NIH", url: "https://www.ninds.nih.gov", category: 'government', focus: ["Neurology", "Stroke"], region: 'NA' },
{ name: "NHLBI", institution: "NIH", url: "https://www.nhlbi.nih.gov", category: 'government', focus: ["Cardiology", "Lung Disease"], region: 'NA' },
{ name: "NIDDK", institution: "NIH", url: "https://www.niddk.nih.gov", category: 'government', focus: ["Diabetes", "Kidney"], region: 'NA' },
{ name: "NHGRI", institution: "NIH", url: "https://www.genome.gov", category: 'government', focus: ["Genomics"], region: 'NA' },
{ name: "National Eye Institute", institution: "NIH", url: "https://www.nei.nih.gov", category: 'government', focus: ["Ophthalmology"], region: 'NA' },
{ name: "NIBIB", institution: "NIH", url: "https://www.nibib.nih.gov", category: 'government', focus: ["Biomedical Imaging"], region: 'NA' },
{ name: "NICHD", institution: "NIH", url: "https://www.nichd.nih.gov", category: 'government', focus: ["Child Health"], region: 'NA' },
{ name: "NIA", institution: "NIH", url: "https://www.nia.nih.gov", category: 'government', focus: ["Aging"], region: 'NA' },
{ name: "National Library of Medicine", institution: "NIH", url: "https://www.nlm.nih.gov", category: 'government', focus: ["Medical Informatics"], region: 'NA' },

// =================================================================
// GOVERNMENT & INTERNATIONAL HEALTH ORGS
// =================================================================
{ name: "CDC", url: "https://www.cdc.gov", category: 'government', focus: ["Infectious Disease", "Public Health"], region: 'NA' },
{ name: "FDA CDER", url: "https://www.fda.gov/about-fda/center-drug-evaluation-and-research-cder", category: 'government', focus: ["Drug Approval"], region: 'NA' },
{ name: "FDA CBER", url: "https://www.fda.gov/about-fda/fda-organization/center-biologics-evaluation-and-research-cber", category: 'government', focus: ["Biologics", "Vaccines"], region: 'NA' },
{ name: "WHO", url: "https://www.who.int/health-topics", category: 'government', focus: ["Global Health"], region: 'GLOBAL' },
{ name: "EMA", url: "https://www.ema.europa.eu/en", category: 'government', focus: ["Drug Regulation"], region: 'EU' },
{ name: "Wellcome Trust", url: "https://wellcome.org/what-we-do/our-work", category: 'government', focus: ["Global Health", "Biomedical"], region: 'GLOBAL' },

// =================================================================
// PHARMA & BIOTECH INDUSTRY
// =================================================================
{ name: "Pfizer Research", url: "https://www.pfizer.com/science/research-development", category: 'industry', focus: ["Drug Discovery", "Vaccines"], region: 'NA' },
{ name: "Moderna", url: "https://www.modernatx.com/research", category: 'industry', focus: ["mRNA", "Vaccines"], region: 'NA' },
{ name: "Roche Research", url: "https://www.roche.com/research_and_development", category: 'industry', focus: ["Oncology", "Diagnostics"], region: 'EU' },
{ name: "Novartis Research", url: "https://www.novartis.com/research-development", category: 'industry', focus: ["Gene Therapy", "CAR-T"], region: 'EU' },
{ name: "Johnson & Johnson Innovation", url: "https://www.jnjinnovation.com", category: 'industry', focus: ["MedTech", "Pharma"], region: 'NA' },
{ name: "Merck Research Labs", url: "https://www.merck.com/research/", category: 'industry', focus: ["Oncology", "Vaccines"], region: 'NA' },
{ name: "AstraZeneca R&D", url: "https://www.astrazeneca.com/r-d.html", category: 'industry', focus: ["Oncology", "Respiratory"], region: 'EU' },
{ name: "Sanofi R&D", url: "https://www.sanofi.com/en/science-and-innovation", category: 'industry', focus: ["Immunology", "Rare Diseases"], region: 'EU' },
{ name: "Genentech Research", url: "https://www.gene.com/research", category: 'industry', focus: ["Biologics", "Oncology"], region: 'NA' },
{ name: "Gilead Sciences", url: "https://www.gilead.com/science-and-medicine/research", category: 'industry', focus: ["Antivirals", "Oncology"], region: 'NA' },
{ name: "BioNTech", url: "https://www.biontech.com/int/en/home/research-development.html", category: 'industry', focus: ["mRNA", "Cancer Vaccines"], region: 'EU' },
{ name: "Regeneron", url: "https://www.regeneron.com/science", category: 'industry', focus: ["Antibodies", "Genomics"], region: 'NA' },
{ name: "Vertex Pharmaceuticals", url: "https://www.vrtx.com/research-development/", category: 'industry', focus: ["Cystic Fibrosis", "Gene Editing"], region: 'NA' },
{ name: "Illumina", url: "https://www.illumina.com/science.html", category: 'industry', focus: ["Genomic Sequencing"], region: 'NA' },
{ name: "Amgen Research", url: "https://www.amgen.com/science", category: 'industry', focus: ["Oncology", "Biosimilars"], region: 'NA' },
{ name: "Bristol Myers Squibb", url: "https://www.bms.com/researchers-and-partners.html", category: 'industry', focus: ["Immuno-Oncology"], region: 'NA' },
{ name: "Eli Lilly Research", url: "https://www.lilly.com/discovery", category: 'industry', focus: ["Neuroscience", "Diabetes"], region: 'NA' },
{ name: "Takeda Research", url: "https://www.takeda.com/what-we-do/research-and-development/", category: 'industry', focus: ["Rare Diseases", "Oncology"], region: 'ASIA' },

// =================================================================
// MEDICAL AI STARTUPS
// =================================================================
{ name: "Hippocratic AI", url: "https://www.hippocratic.ai", category: 'startup', focus: ["Healthcare LLMs", "Clinical AI"], region: 'NA' },
{ name: "Abridge", url: "https://www.abridge.com", category: 'startup', focus: ["Clinical Documentation", "NLP"], region: 'NA' },
{ name: "Ambience Healthcare", url: "https://www.ambiencehealthcare.com", category: 'startup', focus: ["AI Scribes"], region: 'NA' },
{ name: "PathAI", url: "https://www.pathai.com", category: 'startup', focus: ["Pathology", "Cancer Detection"], region: 'NA' },
{ name: "Tempus", url: "https://www.tempus.com", category: 'startup', focus: ["Precision Medicine", "Genomics"], region: 'NA' },
{ name: "Paige AI", url: "https://paige.ai", category: 'startup', focus: ["Digital Pathology"], region: 'NA' },
{ name: "Butterfly Network", url: "https://www.butterflynetwork.com", category: 'startup', focus: ["Ultrasound", "Point-of-Care"], region: 'NA' },
{ name: "Viz.ai", url: "https://www.viz.ai", category: 'startup', focus: ["Stroke Detection", "Medical Imaging"], region: 'NA' },
{ name: "Insitro", url: "https://insitro.com", category: 'startup', focus: ["Drug Discovery", "ML"], region: 'NA' },
{ name: "Recursion Pharma", url: "https://www.recursion.com", category: 'startup', focus: ["Drug Discovery", "AI"], region: 'NA' },
{ name: "BenevolentAI", url: "https://www.benevolent.com", category: 'startup', focus: ["Drug Discovery"], region: 'EU' },
{ name: "Exscientia", url: "https://www.exscientia.ai", category: 'startup', focus: ["AI Drug Design"], region: 'EU' },
{ name: "Freenome", url: "https://www.freenome.com", category: 'startup', focus: ["Cancer Screening"], region: 'NA' },
{ name: "Grail", url: "https://grail.com", category: 'startup', focus: ["Cancer Detection"], region: 'NA' },
{ name: "Owkin", url: "https://www.owkin.com", category: 'startup', focus: ["Federated Learning", "Oncology"], region: 'EU' },

// =================================================================
// MEDICAL AI GITHUB PROJECTS
// =================================================================
{ name: "Project MONAI", url: "https://github.com/Project-MONAI/MONAI", category: 'github', focus: ["Medical Imaging", "PyTorch"], region: 'GLOBAL' },
{ name: "NVIDIA Clara", url: "https://github.com/NVIDIA/clara-train-examples", category: 'github', focus: ["Healthcare Imaging", "GPU"], region: 'GLOBAL' },
{ name: "Microsoft InnerEye", url: "https://github.com/microsoft/InnerEye-DeepLearning", category: 'github', focus: ["Radiotherapy", "Medical Imaging"], region: 'GLOBAL' },
{ name: "FastAI Medical", url: "https://github.com/fastai/medical-imaging", category: 'github', focus: ["Medical Imaging"], region: 'GLOBAL' },
{ name: "MedCAT", url: "https://github.com/CogStack/MedCAT", category: 'github', focus: ["Clinical NLP"], region: 'GLOBAL' },
{ name: "BioGPT", url: "https://github.com/microsoft/BioGPT", category: 'github', focus: ["Biomedical NLP"], region: 'GLOBAL' },
{ name: "BioBERT", url: "https://github.com/dmis-lab/biobert", category: 'github', focus: ["Biomedical Text Mining"], region: 'GLOBAL' },
{ name: "CheXNet", url: "https://github.com/zoogzog/chexnet", category: 'github', focus: ["Chest X-Ray"], region: 'GLOBAL' },
{ name: "DeepChem", url: "https://github.com/deepchem/deepchem", category: 'github', focus: ["Drug Discovery"], region: 'GLOBAL' },
{ name: "TorchXRayVision", url: "https://github.com/mlmed/torchxrayvision", category: 'github', focus: ["X-Ray Analysis"], region: 'GLOBAL' },
{ name: "nnU-Net", url: "https://github.com/MIC-DKFZ/nnUNet", category: 'github', focus: ["Medical Segmentation"], region: 'GLOBAL' },
];
