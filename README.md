# npm-cache-benchmark

A comparison of installation times using [npm](https://www.npmjs.com/) 4.x and 5.x, npm & [shrinkpack](https://github.com/JamieMason/shrinkpack), and [yarn](https://github.com/yarnpkg/yarn).

## Latest Results

| Installer | Average Time |
|:--|--:|
| npm 5.x (shrinkpacked) | 11.23s |
| npm 5.x (shrinkpacked, compressed) | 11.24s |
| npm 5.x (cached) | 12.38s |
| npm 5.x npm | 15.11s |
| npm 4.x (cached) | 15.36s |
| yarn --offline | 16.07s |
| yarn | 18.16s |
| npm 4.x (shrinkpacked) | 20.60s |
| npm 4.x (shrinkpacked, compressed) | 21.39s |
| npm 4.x | 28.80s |

## Usage

You will need Docker installed to run the benchmarks.

```
git clone git@github.com:siddharthkp/npm-cache-benchmark.git

# you only need to build the docker image once
npm run build

# then run this each time you want to run the benchmarks
npm run benchmark
```

## Full Results

```
Run 1
npm/npm: 30.06s (average 30.06s)
npm/npm-cached: 14.73s (average 14.73s)
npm/shrinkpack: 21.57s (average 21.57s)
npm/shrinkpack-compressed: 20.90s (average 20.90s)
yarn/yarn: 17.84s (average 17.84s)
yarn/yarn-offline: 16.10s (average 16.10s)
npm5/npm: 14.68s (average 14.68s)
npm5/npm-cached: 14.60s (average 14.60s)
npm5/shrinkpack: 10.96s (average 10.96s)
npm5/shrinkpack-compressed: 11.22s (average 11.22s)

Run 2
npm/npm: 28.25s (average 29.16s)
npm/npm-cached: 15.20s (average 14.96s)
npm/shrinkpack: 19.63s (average 20.60s)
npm/shrinkpack-compressed: 21.05s (average 20.98s)
yarn/yarn: 16.11s (average 16.98s)
yarn/yarn-offline: 16.04s (average 16.07s)
npm5/npm: 14.94s (average 14.81s)
npm5/npm-cached: 11.69s (average 13.15s)
npm5/shrinkpack: 11.22s (average 11.09s)
npm5/shrinkpack-compressed: 11.02s (average 11.12s)

Run 3
npm/npm: 27.72s (average 28.68s)
npm/npm-cached: 14.88s (average 14.94s)
npm/shrinkpack: 19.84s (average 20.35s)
npm/shrinkpack-compressed: 20.82s (average 20.92s)
yarn/yarn: 16.29s (average 16.75s)
yarn/yarn-offline: 16.42s (average 16.19s)
npm5/npm: 14.97s (average 14.86s)
npm5/npm-cached: 11.64s (average 12.64s)
npm5/shrinkpack: 11.02s (average 11.07s)
npm5/shrinkpack-compressed: 11.00s (average 11.08s)

Run 4
npm/npm: 29.43s (average 28.87s)
npm/npm-cached: 17.16s (average 15.49s)
npm/shrinkpack: 21.94s (average 20.75s)
npm/shrinkpack-compressed: 22.36s (average 21.28s)
yarn/yarn: 20.37s (average 17.65s)
yarn/yarn-offline: 15.88s (average 16.11s)
npm5/npm: 15.20s (average 14.95s)
npm5/npm-cached: 11.88s (average 12.45s)
npm5/shrinkpack: 11.60s (average 11.20s)
npm5/shrinkpack-compressed: 11.57s (average 11.20s)

Run 5
npm/npm: 28.54s (average 28.80s)
npm/npm-cached: 14.84s (average 15.36s)
npm/shrinkpack: 20.01s (average 20.60s)
npm/shrinkpack-compressed: 21.83s (average 21.39s)
yarn/yarn: 20.19s (average 18.16s)
yarn/yarn-offline: 15.90s (average 16.07s)
npm5/npm: 15.74s (average 15.11s)
npm5/npm-cached: 12.07s (average 12.38s)
npm5/shrinkpack: 11.35s (average 11.23s)
npm5/shrinkpack-compressed: 11.41s (average 11.24s)
```
