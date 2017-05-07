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
npm 4.x: 28.77s (average 28.77s)
npm 4.x (cached): 23.47s (average 23.47s)
npm 4.x (shrinkpacked): 19.64s (average 19.64s)
npm 4.x (shrinkpacked, compressed): 19.87s (average 19.87s)
yarn: 19.87s (average 19.87s)
yarn --offline: 12.77s (average 12.77s)
npm 5.x: 14.96s (average 14.96s)
npm 5.x (cached): 14.48s (average 14.48s)
npm 5.x (shrinkpacked): 15.38s (average 15.38s)
npm 5.x (shrinkpacked, compressed): 14.22s (average 14.22s)

Run 2
npm 4.x: 29.52s (average 29.14s)
npm 4.x (cached): 25.86s (average 24.66s)
npm 4.x (shrinkpacked): 21.02s (average 20.33s)
npm 4.x (shrinkpacked, compressed): 20.55s (average 20.21s)
yarn: 19.59s (average 19.73s)
yarn --offline: 13.51s (average 13.14s)
npm 5.x: 14.07s (average 14.52s)
npm 5.x (cached): 11.26s (average 12.87s)
npm 5.x (shrinkpacked): 7.63s (average 11.50s)
npm 5.x (shrinkpacked, compressed): 8.07s (average 11.15s)

Run 3
npm 4.x: 26.86s (average 28.38s)
npm 4.x (cached): 24.51s (average 24.61s)
npm 4.x (shrinkpacked): 19.35s (average 20.01s)
npm 4.x (shrinkpacked, compressed): 18.84s (average 19.75s)
yarn: 18.47s (average 19.31s)
yarn --offline: 12.09s (average 12.79s)
npm 5.x: 13.90s (average 14.31s)
npm 5.x (cached): 13.79s (average 13.18s)
npm 5.x (shrinkpacked): 10.35s (average 11.12s)
npm 5.x (shrinkpacked, compressed): 10.69s (average 10.99s)

Run 4
npm 4.x: 27.78s (average 28.23s)
npm 4.x (cached): 24.69s (average 24.63s)
npm 4.x (shrinkpacked): 19.06s (average 19.77s)
npm 4.x (shrinkpacked, compressed): 18.72s (average 19.49s)
yarn: 17.92s (average 18.96s)
yarn --offline: 13.95s (average 13.08s)
npm 5.x: 13.61s (average 14.14s)
npm 5.x (cached): 13.69s (average 13.31s)
npm 5.x (shrinkpacked): 10.33s (average 10.92s)
npm 5.x (shrinkpacked, compressed): 10.53s (average 10.88s)

Run 5
npm 4.x: 27.22s (average 28.03s)
npm 4.x (cached): 25.44s (average 24.79s)
npm 4.x (shrinkpacked): 20.00s (average 19.81s)
npm 4.x (shrinkpacked, compressed): 19.13s (average 19.42s)
yarn: 18.65s (average 18.90s)
yarn --offline: 14.81s (average 13.43s)
npm 5.x: 14.51s (average 14.21s)
npm 5.x (cached): 13.88s (average 13.42s)
npm 5.x (shrinkpacked): 10.30s (average 10.80s)
npm 5.x (shrinkpacked, compressed): 10.60s (average 10.82s)
```

<!-- links -->
[1]: https://www.npmjs.com
[2]: https://www.npmjs.com/package/npm5
[3]: https://github.com/JamieMason/shrinkpack
[4]: https://github.com/yarnpkg/yarn
[5]: https://www.docker.com
