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
npm: 19.508s
npm-cached: 17.781s
shrinkpack: 9.563s
shrinkpack-compressed: 9.767s
yarn: 5.776s
npm5: 15.561s
npm5-cached: 16.351s
npm5-shrinkpack: 1.216s
npm5-shrinkpack-compressed: 8.817s
```
