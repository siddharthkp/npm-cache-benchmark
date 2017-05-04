# npm-cache-benchmark

Benchmark npm 4 and 5 with cache vs [shrinkpack](https://github.com/JamieMason/shrinkpack) vs [yarn](https://github.com/yarnpkg/yarn).

## Usage

You will need Docker installed to run the benchmarks.

```
git clone git@github.com:siddharthkp/npm-cache-benchmark.git

# you only need to build the docker image once
npm run build

# then run this each time you want to run the benchmarks
npm run benchmark
```

## Latest Results

```
npm: 24.208s
npm-cached: 14.007s
shrinkpack: 9.829s
shrinkpack-compressed: 11.273s
yarn: 6.5s
npm5: 20.158s
npm5-cached: 19.345s
npm5-shrinkpack: 1.145s
npm5-shrinkpack-compressed: 9.044s
```
