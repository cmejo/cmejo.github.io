# CHRISTOPHER MEJO, Ph.D.
**AI Research Scientist — LLM & Reinforcement Learning Systems**

- **Email**: [work@cmejo.com](mailto:work@cmejo.com)
- **Phone**: (917) 747-8865
- **Location**: New York, NY
- **Website**: [https://cmejo.com](https://cmejo.com)
- **Resume (PDF)**: [https://cmejo.com/christopher-mejo-resume.pdf](https://cmejo.com/christopher-mejo-resume.pdf)
- **GitHub**: [https://github.com/cmejo](https://github.com/cmejo)
- **LinkedIn**: [https://linkedin.com/in/cmejo](https://linkedin.com/in/cmejo)

---

## SUMMARY
15+ years taking machine learning systems from mathematical theory to high-throughput production. Ph.D. in Physics from Harvard University (quantum complexity theory, completed at age 21) and postdoctoral fellow in theoretical computer science at MIT under Scott Aaronson. Architect of large language model systems (hybrid RAG, distributed pretraining, agentic reasoning) and sequential decision-making engines—owning systems end-to-end from custom CUDA kernels to live production deployment. Solo-architected AI Scholar (15M+ papers, Google Summer of Code Fellow 2024 & 2025).

---

## INDUSTRY EXPERIENCE

### Senior Data Scientist — Braverock LLC (Nov 2021 – Present)
- **Distributed LLM Training**: Directed pretraining and instruction fine-tuning for domain-specific 7B–14B foundation models (DeepSpeed ZeRO-3, custom CUDA memory-mapped tokenizers), cutting per-step latency 38%.
- **Enterprise RAG (10M+ Docs)**: Engineered a production retrieval pipeline over SEC filings, earnings transcripts, and research reports using custom domain embeddings and vector indexing.
- **Sub-Millisecond Transformers**: Deployed time-series transformer models processing 1B+ quote events per day at microsecond-scale inference latency.
- **Reinforcement Learning Execution**: Architected DQN and actor-critic portfolio optimization agents, improving live and backtested Sharpe ratio 23% over the prior production baseline.
- **Graph Attention Networks**: Built dynamic Heterogeneous Graph Attention Networks (HAN) capturing multi-horizon cross-asset dependencies, raising regime-shift detection accuracy 19%.
- **Live Production Performance**: Delivered a 6.2 Sharpe ratio (Sortino 8.4, max drawdown <1.9%) over a 24-month continuous live window executing billions in volume, plus a 2.63-Sharpe beta-neutral strategy on $60M+ AUM.

### Senior Data Scientist — Cushion AI (Apr 2021 – Oct 2021)
- **Automated Negotiation LLM**: Created CushionNLP, a proprietary BERT-based dialogue agent that increased bank-fee negotiation success 30% and generated $2M+ in annual customer savings.
- **Graph Transaction Classification**: Architected a GNN and ensemble categorization pipeline across 80M+ transactions (~300 institutions), reaching 95% accuracy and halving runtime vs. legacy rule engines.

### Research Data Scientist — RapidRads AI (2019 – Feb 2021)
- **Federated Clinical Computer Vision**: Deployed a differentially private (ε = 1.2, δ = 10^-5) EfficientNet-B7 diagnostic system across 4 hospitals, achieving 0.972 ROC-AUC (96.5% sensitivity, 98.2% specificity).
- **Clinical Interpretability**: Integrated multi-CNN ensembles with Grad-CAM saliency attribution and calibrated uncertainty quantification for radiologist validation.

### Senior Data Scientist & Cybersecurity Researcher — Confiant (2017 – 2019)
- **Adversarial & Botnet Detection**: Engineered GraphSAGE relational models and unsupervised anomaly detectors (LSTM autoencoders, Isolation Forest, One-Class SVM) securing 1B+ daily ad requests against coordinated attacks.

### CEO & Lead Architect — Cronode (2011 – 2017)
- **Search & Recommendation Infrastructure**: Designed hybrid collaborative-filtering recommendation engines and custom Apache Solr ranking architectures from the ground up.

---

## RESEARCH FELLOWSHIPS & OPEN SOURCE

### Google Summer of Code Fellow (2024 & 2025) — R Foundation for Statistical Computing
*AI Scholar Project ([github.com/cmejo/AI_Scholar](https://github.com/cmejo/AI_Scholar))*
- **Hybrid Graph-Vector Retrieval**: Solo-architected an open-source scientific RAG platform uniting FAISS dense vectors, BM25 sparse search, and Neo4j knowledge graphs across 15M+ papers.
- **Meta-Learned Personalization**: Designed an adaptive retrieval router using MAML meta-learning, lifting NDCG@10 by 40% on a 200-query citation-grounded benchmark.
- **Verifiable Agentic Reasoning**: Implemented chain-of-thought synthesis with strict citation attribution, calibrated epistemic uncertainty (MC dropout, evidential deep learning), and automated entity-relation extraction (spaCy, BERT-NER).

### Visiting Research Scientist (Part-Time) — Sandia National Laboratories & Google Quantum AI (2020 – 2024)
- **Variational Quantum Algorithms**: Senior researcher in a joint Google Quantum AI initiative developing variational quantum eigensolvers (VQE) for non-Abelian lattice gauge theory.
- **Quantum Error Correction & HPC**: Designed surface-code protocols and resource estimators in Qiskit and Cirq; executed 50+ qubit tensor-network simulations on SLURM clusters and co-authored DARPA/IARPA proposals.

---

## EDUCATION & CLEARANCE
- **Postdoctoral Fellowship, Theoretical Computer Science** — Massachusetts Institute of Technology (2010–2012). Advisor: Dr. Scott Aaronson.
- **Ph.D. in Physics** — Harvard University (2007–2010). Quantum Information & Complexity Theory; completed at age 21.
- **B.S. in Physics & Computer Science** — Harvard University (2004–2007).
- **U.S. Security Clearance** — Active Top Secret / Sensitive Compartmented Information (TS/SCI).

---

## TECHNICAL STACK
- **Languages & Kernels**: Python, C++, C, CUDA, R, x86 Assembly, Java, JavaScript
- **LLM & RAG Architecture**: Dense/Sparse/Graph RAG, FAISS, BM25, Neo4j, vLLM, LangGraph, LangChain, Custom Embeddings, BERT-NER, Chain-of-Thought, Uncertainty Quantification (MC Dropout, Evidential DL)
- **Deep Learning & RL**: PyTorch, JAX, TensorFlow, Transformers, DQN, Actor-Critic, MAML Meta-Learning, Graph Neural Networks (HAN, GraphSAGE)
- **Distributed Systems & MLOps**: DeepSpeed ZeRO-3, Multi-GPU Pretraining, Ray, SLURM, Kubernetes, Docker, Kubeflow, MLflow, Airflow, W&B
- **Quantum & Privacy**: Differential Privacy (ε-δ), Federated Learning, Qiskit, Cirq, Surface Codes, VQE
