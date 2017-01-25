#### npm-cache-benchmark

&nbsp;

Benchmark npm with cache vs [shrinkpack](https://github.com/JamieMason/shrinkpack) vs [yarn](https://github.com/yarnpkg/yarn).

Read the article here: [npm cache: the unsung hero](https://medium.com/@siddharthkp/npm-cache-the-unsung-hero-11e646c09791#.rmetu4dpg)

&nbsp;
&nbsp;

![unsung hero](https://raw.githubusercontent.com/siddharthkp/npm-cache-benchmark/master/hero.png)

&nbsp;

#### TL;DR

+ Run `npm config set cache-min 9999999` on your terminal and profit!
+ To add offline support to npm, check out [shrinkpack](https://github.com/JamieMason/shrinkpack).
+ For offline support and really fast installs, try [yarn](https://github.com/yarnpkg/yarn).

#### Usage

You will need Docker installed to run the benchmarks.

```
git clone git@github.com:siddharthkp/npm-cache-benchmark.git

# you only need to build the docker image once
npm run build

# then run this each time you want to run the benchmarks
npm run benchmark
```

#### Show your support

:star: this repo

#### Some benchmarks

```
npm: 15.556s
npm-cached: 11.321s
shrinkpack: 10.857s
shrinkpack-compressed: 11.961s
yarn: 6.413s
```

#### License

MIT © [siddharthkp](https://github.com/siddharthkp)
