# npm vs shrinkpack vs npm5 vs yarn

Benchmarks of [npm][1], [npm5][2], [shrinkpack][3], and [yarn][4] install times.

## Results

### Docker

| Installer | Average over 5 runs |
|:--|--:|
| npm 5.x (shrinkpacked) | 1.26s |
| npm 5.x (shrinkpacked, compressed) | 10.57s |
| npm 5.x (cached) | 11.14s |
| yarn | 11.80s |
| yarn --offline | 11.96s |
| npm 5.x | 15.96s |
| npm 4.x (cached) | 16.04s |
| npm 4.x (shrinkpacked) | 20.38s |
| npm 4.x (shrinkpacked, compressed) | 21.38s |
| npm 4.x | 28.39s |

### OS X

| Installer | Average over 5 runs |
|:--|--:|
| npm 5.x (shrinkpacked) | 11.84s |
| npm 5.x (shrinkpacked, compressed) | 12.08s |
| npm 5.x (cached) | 12.33s |
| npm 5.x | 15.16s |
| npm 4.x (cached) | 15.81s |
| yarn --offline | 16.71s |
| yarn | 17.66s |
| npm 4.x (shrinkpacked) | 20.92s |
| npm 4.x (shrinkpacked, compressed) | 21.44s |
| npm 4.x | 28.61s |

## Running the Benchmarks

### Locally

```
git clone https://github.com/JamieMason/npm-cache-benchmark.git
cd npm-cache-benchmark
node index.js
```

### In Docker

```
git clone https://github.com/JamieMason/npm-cache-benchmark.git

cd npm-cache-benchmark

# You only need to build the docker image once.
npm run build

# Then run this each time you want to run the benchmarks
npm run benchmark
```

## Full Results

### Docker

```
$ npmr benchmark

> npm-cache-benchmark@2.0.0 benchmark /Users/foldleft/Development/npm-cache-benchmark
> docker run -w /benchmarks npm-cache-benchmark node index.js

Run 1
npm 4.x: 29.07s (average 29.07s)
npm 4.x (cached): 24.57s (average 24.57s)
npm 4.x (shrinkpacked): 20.74s (average 20.74s)
npm 4.x (shrinkpacked, compressed): 22.41s (average 22.41s)
yarn: 11.96s (average 11.96s)
yarn --offline: 11.64s (average 11.64s)
npm 5.x: 17.05s (average 17.05s)
npm 5.x (cached): 14.46s (average 14.46s)
npm 5.x (shrinkpacked): 1.17s (average 1.17s)
npm 5.x (shrinkpacked, compressed): 12.52s (average 12.52s)

Run 2
npm 4.x: 28.18s (average 28.63s)
npm 4.x (cached): 14.23s (average 19.40s)
npm 4.x (shrinkpacked): 20.72s (average 20.73s)
npm 4.x (shrinkpacked, compressed): 21.79s (average 22.10s)
yarn: 11.91s (average 11.93s)
yarn --offline: 11.48s (average 11.56s)
npm 5.x: 15.37s (average 16.21s)
npm 5.x (cached): 10.53s (average 12.50s)
npm 5.x (shrinkpacked): 1.14s (average 1.16s)
npm 5.x (shrinkpacked, compressed): 10.68s (average 11.60s)

Run 3
npm 4.x: 27.95s (average 28.40s)
npm 4.x (cached): 14.23s (average 17.68s)
npm 4.x (shrinkpacked): 20.07s (average 20.51s)
npm 4.x (shrinkpacked, compressed): 20.28s (average 21.49s)
yarn: 11.51s (average 11.79s)
yarn --offline: 13.38s (average 12.17s)
npm 5.x: 15.73s (average 16.05s)
npm 5.x (cached): 10.13s (average 11.71s)
npm 5.x (shrinkpacked): 1.14s (average 1.15s)
npm 5.x (shrinkpacked, compressed): 10.04s (average 11.08s)

Run 4
npm 4.x: 27.10s (average 28.07s)
npm 4.x (cached): 13.33s (average 16.59s)
npm 4.x (shrinkpacked): 20.60s (average 20.53s)
npm 4.x (shrinkpacked, compressed): 20.96s (average 21.36s)
yarn: 11.03s (average 11.60s)
yarn --offline: 11.43s (average 11.98s)
npm 5.x: 16.02s (average 16.04s)
npm 5.x (cached): 10.34s (average 11.37s)
npm 5.x (shrinkpacked): 1.67s (average 1.28s)
npm 5.x (shrinkpacked, compressed): 9.85s (average 10.77s)

Run 5
npm 4.x: 29.66s (average 28.39s)
npm 4.x (cached): 13.84s (average 16.04s)
npm 4.x (shrinkpacked): 19.78s (average 20.38s)
npm 4.x (shrinkpacked, compressed): 21.44s (average 21.38s)
yarn: 12.61s (average 11.80s)
yarn --offline: 11.88s (average 11.96s)
npm 5.x: 15.62s (average 15.96s)
npm 5.x (cached): 10.22s (average 11.14s)
npm 5.x (shrinkpacked): 1.16s (average 1.26s)
npm 5.x (shrinkpacked, compressed): 9.76s (average 10.57s)
```

### OS X

```
$ node index.js

Run 1
npm 4.x: 29.62s (average 29.62s)
npm 4.x (cached): 15.99s (average 15.99s)
npm 4.x (shrinkpacked): 20.89s (average 20.89s)
npm 4.x (shrinkpacked, compressed): 21.30s (average 21.30s)
yarn: 17.41s (average 17.41s)
yarn --offline: 17.31s (average 17.31s)
npm 5.x: 14.71s (average 14.71s)
npm 5.x (cached): 14.58s (average 14.58s)
npm 5.x (shrinkpacked): 14.59s (average 14.59s)
npm 5.x (shrinkpacked, compressed): 15.14s (average 15.14s)

Run 2
npm 4.x: 28.33s (average 28.98s)
npm 4.x (cached): 15.29s (average 15.64s)
npm 4.x (shrinkpacked): 21.13s (average 21.01s)
npm 4.x (shrinkpacked, compressed): 21.92s (average 21.61s)
yarn: 17.81s (average 17.61s)
yarn --offline: 15.72s (average 16.52s)
npm 5.x: 15.51s (average 15.11s)
npm 5.x (cached): 11.99s (average 13.29s)
npm 5.x (shrinkpacked): 11.13s (average 12.86s)
npm 5.x (shrinkpacked, compressed): 11.14s (average 13.14s)

Run 3
npm 4.x: 28.20s (average 28.72s)
npm 4.x (cached): 15.94s (average 15.74s)
npm 4.x (shrinkpacked): 20.75s (average 20.92s)
npm 4.x (shrinkpacked, compressed): 21.54s (average 21.59s)
yarn: 16.77s (average 17.33s)
yarn --offline: 16.59s (average 16.54s)
npm 5.x: 15.35s (average 15.19s)
npm 5.x (cached): 12.13s (average 12.90s)
npm 5.x (shrinkpacked): 11.93s (average 12.55s)
npm 5.x (shrinkpacked, compressed): 11.77s (average 12.68s)

Run 4
npm 4.x: 28.14s (average 28.57s)
npm 4.x (cached): 15.22s (average 15.61s)
npm 4.x (shrinkpacked): 20.95s (average 20.93s)
npm 4.x (shrinkpacked, compressed): 21.42s (average 21.55s)
yarn: 16.53s (average 17.13s)
yarn --offline: 17.28s (average 16.72s)
npm 5.x: 14.91s (average 15.12s)
npm 5.x (cached): 10.98s (average 12.42s)
npm 5.x (shrinkpacked): 10.90s (average 12.14s)
npm 5.x (shrinkpacked, compressed): 10.94s (average 12.25s)

Run 5
npm 4.x: 28.78s (average 28.61s)
npm 4.x (cached): 16.62s (average 15.81s)
npm 4.x (shrinkpacked): 20.90s (average 20.92s)
npm 4.x (shrinkpacked, compressed): 21.03s (average 21.44s)
yarn: 19.76s (average 17.66s)
yarn --offline: 16.65s (average 16.71s)
npm 5.x: 15.31s (average 15.16s)
npm 5.x (cached): 11.99s (average 12.33s)
npm 5.x (shrinkpacked): 10.64s (average 11.84s)
npm 5.x (shrinkpacked, compressed): 11.43s (average 12.08s)
```

<!-- links -->
[1]: https://www.npmjs.com
[2]: https://www.npmjs.com/package/npm5
[3]: https://github.com/JamieMason/shrinkpack
[4]: https://github.com/yarnpkg/yarn
[5]: https://www.docker.com
