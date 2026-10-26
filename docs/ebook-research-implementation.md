# Ebook and research implementation checklist

Scope: the ten recommendations in *Ebook-Based Review: Crypto Lab and Cipher Museum*, reviewed 26 October 2026. This checklist tracks implementation and review evidence. Checked items have source changes and validation prepared in the pull requests below; they do not mean merged or deployed.

## Citation policy

Read source books when needed. Credit the full overall book title, author, edition/year and relevant chapter or pages. Do not link to ebook copies, online PDFs of books, or private reading files. Research-paper landing pages and standards may be linked. Distinguish printed pagination from the supplied PDF pagination.

## Work

- [x] C1 — Biham Lens: endpoint differential versus trail; instructor assistance versus attacker preprocessing; exact distinct-data accounting.
- [x] C2 — AES Anatomy: verify ShiftRows dispersion alongside MixColumns branch number and explain the four-round wide-trail theorem.
- [x] C3 — AES Anatomy: reduced four-round integral attack, candidate filtering and separate held-out verification.
- [x] M1 — Cipher Museum: bounded executable Colossus chi-setting experiment with synthetic traffic and multiple-comparison limits.
- [x] M2 — Cipher Museum: seeded, equal-evaluation-budget solver comparison with held-out results and uncertainty.
- [x] M3 — Cipher Museum: bounded staged columnar search with segment moves and restart/score ablations.
- [x] S1 — Both projects: map each implemented lesson to full-title book citations and exact claim scope.
- [x] R1 — LMS Ledger / LMS-XMSS: qualify hash construction and aggregate-use claims; preserve vectors and reuse attacks.
- [x] R2 — Envelope KMS: conditional integrity language and optional trusted expected-length policy; verify both processing paths.
- [x] R3 — Lattice Fault: physical secret-key-unpacking leakage and estimated computation budget; distinguish browser simulation.

## Verification and delivery

The changes are prepared across seven application repositories. None was merged or deployed as part of this work. The hub catalog continues to describe the currently published labs; its AES card must be refreshed against the merged source revision before advertising the tenth act. Do not move a source-review pin to an unmerged feature branch.

| Work | Review | Verification |
| --- | --- | --- |
| C1, S1 | [Biham Lens #20](https://github.com/systemslibrarian/crypto-lab-biham-lens/pull/20) | 41 unit tests, two publish checks, build and 43 browser/accessibility cases passed; GitHub gate passed. |
| C2, C3, S1 | [AES Anatomy #5](https://github.com/systemslibrarian/crypto-lab-aes-anatomy/pull/5) | 56 unit tests, build and 22 browser/accessibility cases passed. All 47 semantic mutations compiled, failed their owning assertions, and restored the exact artifact with tests green; evidence is committed. |
| M1, M2, M3, S1 | [Cipher Museum #12](https://github.com/systemslibrarian/cipher-museum/pull/12) | Full test suite, release metadata and HTML lint passed. Frozen solver results replay exactly; timing observations are recorded separately. Deliberate statistic and incomplete-rectangle defects were rejected. Desktop and narrow Chromium interactions were checked. |
| R1 | [LMS Ledger #23](https://github.com/systemslibrarian/crypto-lab-lms-ledger/pull/23) | 19 unit tests, build and all six browser/accessibility cases passed; GitHub gate passed. The new research links were corrected after the accessibility gate caught insufficient visual distinction. |
| R1 | [LMS/XMSS #27](https://github.com/systemslibrarian/crypto-lab-lms-xmss/pull/27) | All four existing phase gates, build and the new rendered-note check passed; GitHub gate passed. |
| R2 | [Envelope KMS #47](https://github.com/systemslibrarian/crypto-lab-envelope-kms/pull/47) | 170 unit tests, two publish checks, build and rendered-note check passed. GitHub format, coverage, accessibility, mutation and CodeQL gates passed. Local full-browser run had 46 passes and four console-network-error failures; the GitHub accessibility run passed without those environment errors. |
| R3 | [Lattice Fault #27](https://github.com/systemslibrarian/crypto-lab-lattice-fault/pull/27) | 67 unit tests, two publish checks, build and rendered-note check passed; GitHub gate passed. |

GitHub run status can change; each PR is the authoritative location for current checks. The museum's benchmark has only three original texts and does not establish a population-wide solver ranking. The preprint notes explain source conditions rather than claiming independent cryptographic proofs or physical reproduction.

After application PRs are reviewed and merged, verify their deployments, re-read the actual merged AES/Biham sources, update any affected hub card and reviewed commit through the existing catalog workflow, and regenerate dependent catalog/teaching records. This publication step remains outstanding; the ten implementation checkmarks must not be read as a live-release claim.

## Claim-to-source mapping

| Work | Full source credit | Pages and supported scope |
| --- | --- | --- |
| C1: Biham Lens differential model | Eli Biham and Adi Shamir, *Differential Cryptanalysis of the Data Encryption Standard* (1993; authors' LaTeX rendering dated 7 December 2009) | §§3.3–3.4, printed pp. 22–30 / supplied PDF pp. 28–36. A characteristic fixes intermediate differences; an endpoint differential sums trails. The public round-independence model is not a fixed-key theorem for the toy's dependent key schedule. |
| C2: AES Anatomy wide-trail explanation | Joan Daemen and Vincent Rijmen, *The Design of Rijndael: The Advanced Encryption Standard (AES)*, second edition (2020) | Theorem 9.5.1 and surrounding proof, printed pp. 140–143 / PDF pp. 160–163. Branch number and ShiftRows dispersion support a four-round trail bound; an observed trace is not its proof and a trail bound is not a hull/full-cipher guarantee. |
| C3: AES Anatomy integral exercise | Joan Daemen and Vincent Rijmen, *The Design of Rijndael: The Advanced Encryption Standard (AES)*, second edition (2020) | Printed pp. 150–152 / PDF pp. 170–172. Complete Lambda-sets balance after three rounds; a final-round-shaped fourth round enables bytewise inverse-S-box filtering. This exercise is not full AES. |
| M1: Cipher Museum chi-setting | I. J. Good, Donald Michie and Geoffrey Timms, *General Report on Tunny* (1945) | §§23A–C, printed pp. 78–80 / collected PDF pp. 81–83; §§53A–D, printed pp. 333–335 / PDF pp. 327–329. Known patterns, setting search, two-impulse counting and multiple-comparison limits. Synthetic traffic and null simulations are explicitly modern teaching choices. |
| M2/M3: Cipher Museum evaluation and columnar search | George Lasry, *A Methodology for the Cryptanalysis of Classical Ciphers with Search Metaheuristics* (2018) | §§4.5–4.7, printed pp. 57–60 / PDF pp. 78–81; §§5.3.2–5.3.4, printed pp. 69–78 / PDF pp. 90–99. Evaluation discipline, segment moves, adjacency and alignment. Bounded browser adaptations do not reproduce the thesis's large-key performance claims. |

R1–R3 cite the supplied October 2026 research papers by full title and public ePrint landing page in their respective README and rendered notes. Those notes distinguish theoretical bounds, physical measurements, estimated computation and the browser demonstrations. They do not cite online book copies.
