# Static Analysis of ATS logs
CrossEntropy analysis of the ATS logs.

## Getting started

Install the staticAnalysis

```console
npm install
```

Launch the analysis:

```console
node ./agilitestAnalysis.js
```

It makes an analysis of the ATS logs of the **ats** directory

```console
Analysis of 5 logs (Infinity means original):
File actions.5.xml : 0.11737132082530506
File actions.4.xml : 0.13514209534067567
File actions.3.xml : 0.37614691515386517
File actions.2.xml : 0.47227607204976096
File actions.1.xml : Infinity
20% are original (saturation is below 33%)
```

The analysis states that only one logs is original. The 4 other ones are not original.
It also states that the set of logs reaches saturation.

## Make your analysis

Create your ATS logs and store them in a directory (the one you want)

Launch the analysis:

```console
node ./agilitestAnalysis.js dirname
```