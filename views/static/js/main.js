(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __pow = Math.pow;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/ts/listeners/error-listener.ts
  var setErrorListener = () => {
    const errors = [];
    window.addEventListener("error", (errorEvent) => {
      const {
        filename,
        error: { message, stack, name }
      } = errorEvent;
      const errString = [filename, message, name].join("");
      if (errors.indexOf(errString) === -1) {
        errors.push(errString);
        const params = new URLSearchParams({
          name,
          message,
          stack
        });
        fetch(`/static/js/error.js?${params.toString()}`);
      }
    });
  };

  // src/ts/listeners/load-listener.ts
  var setLoadListener = () => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js");
      });
    }
  };

  // node_modules/fuse.js/dist/fuse.esm.js
  function isArray(value) {
    return !Array.isArray ? getTag(value) === "[object Array]" : Array.isArray(value);
  }
  var INFINITY = 1 / 0;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    let result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function isString(value) {
    return typeof value === "string";
  }
  function isNumber(value) {
    return typeof value === "number";
  }
  function isBoolean(value) {
    return value === true || value === false || isObjectLike(value) && getTag(value) == "[object Boolean]";
  }
  function isObject(value) {
    return typeof value === "object";
  }
  function isObjectLike(value) {
    return isObject(value) && value !== null;
  }
  function isDefined(value) {
    return value !== void 0 && value !== null;
  }
  function isBlank(value) {
    return !value.trim().length;
  }
  function getTag(value) {
    return value == null ? value === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(value);
  }
  var INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
  var LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) => `Invalid value for key ${key}`;
  var PATTERN_LENGTH_TOO_LARGE = (max) => `Pattern length exceeds max of ${max}.`;
  var MISSING_KEY_PROPERTY = (name) => `Missing ${name} property in key`;
  var INVALID_KEY_WEIGHT_VALUE = (key) => `Property 'weight' in key '${key}' must be a positive integer`;
  var hasOwn = Object.prototype.hasOwnProperty;
  var KeyStore = class {
    constructor(keys) {
      this._keys = [];
      this._keyMap = {};
      let totalWeight = 0;
      keys.forEach((key) => {
        let obj = createKey(key);
        totalWeight += obj.weight;
        this._keys.push(obj);
        this._keyMap[obj.id] = obj;
        totalWeight += obj.weight;
      });
      this._keys.forEach((key) => {
        key.weight /= totalWeight;
      });
    }
    get(keyId) {
      return this._keyMap[keyId];
    }
    keys() {
      return this._keys;
    }
    toJSON() {
      return JSON.stringify(this._keys);
    }
  };
  function createKey(key) {
    let path = null;
    let id = null;
    let src = null;
    let weight = 1;
    if (isString(key) || isArray(key)) {
      src = key;
      path = createKeyPath(key);
      id = createKeyId(key);
    } else {
      if (!hasOwn.call(key, "name")) {
        throw new Error(MISSING_KEY_PROPERTY("name"));
      }
      const name = key.name;
      src = name;
      if (hasOwn.call(key, "weight")) {
        weight = key.weight;
        if (weight <= 0) {
          throw new Error(INVALID_KEY_WEIGHT_VALUE(name));
        }
      }
      path = createKeyPath(name);
      id = createKeyId(name);
    }
    return { path, id, weight, src };
  }
  function createKeyPath(key) {
    return isArray(key) ? key : key.split(".");
  }
  function createKeyId(key) {
    return isArray(key) ? key.join(".") : key;
  }
  function get(obj, path) {
    let list = [];
    let arr = false;
    const deepGet = (obj2, path2, index) => {
      if (!isDefined(obj2)) {
        return;
      }
      if (!path2[index]) {
        list.push(obj2);
      } else {
        let key = path2[index];
        const value = obj2[key];
        if (!isDefined(value)) {
          return;
        }
        if (index === path2.length - 1 && (isString(value) || isNumber(value) || isBoolean(value))) {
          list.push(toString(value));
        } else if (isArray(value)) {
          arr = true;
          for (let i = 0, len = value.length; i < len; i += 1) {
            deepGet(value[i], path2, index + 1);
          }
        } else if (path2.length) {
          deepGet(value, path2, index + 1);
        }
      }
    };
    deepGet(obj, isString(path) ? path.split(".") : path, 0);
    return arr ? list : list[0];
  }
  var MatchOptions = {
    includeMatches: false,
    findAllMatches: false,
    minMatchCharLength: 1
  };
  var BasicOptions = {
    isCaseSensitive: false,
    includeScore: false,
    keys: [],
    shouldSort: true,
    sortFn: (a, b) => a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1
  };
  var FuzzyOptions = {
    location: 0,
    threshold: 0.6,
    distance: 100
  };
  var AdvancedOptions = {
    useExtendedSearch: false,
    getFn: get,
    ignoreLocation: false,
    ignoreFieldNorm: false,
    fieldNormWeight: 1
  };
  var Config = __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, BasicOptions), MatchOptions), FuzzyOptions), AdvancedOptions);
  var SPACE = /[^ ]+/g;
  function norm(weight = 1, mantissa = 3) {
    const cache = /* @__PURE__ */ new Map();
    const m = Math.pow(10, mantissa);
    return {
      get(value) {
        const numTokens = value.match(SPACE).length;
        if (cache.has(numTokens)) {
          return cache.get(numTokens);
        }
        const norm2 = 1 / Math.pow(numTokens, 0.5 * weight);
        const n = parseFloat(Math.round(norm2 * m) / m);
        cache.set(numTokens, n);
        return n;
      },
      clear() {
        cache.clear();
      }
    };
  }
  var FuseIndex = class {
    constructor({
      getFn = Config.getFn,
      fieldNormWeight = Config.fieldNormWeight
    } = {}) {
      this.norm = norm(fieldNormWeight, 3);
      this.getFn = getFn;
      this.isCreated = false;
      this.setIndexRecords();
    }
    setSources(docs = []) {
      this.docs = docs;
    }
    setIndexRecords(records = []) {
      this.records = records;
    }
    setKeys(keys = []) {
      this.keys = keys;
      this._keysMap = {};
      keys.forEach((key, idx) => {
        this._keysMap[key.id] = idx;
      });
    }
    create() {
      if (this.isCreated || !this.docs.length) {
        return;
      }
      this.isCreated = true;
      if (isString(this.docs[0])) {
        this.docs.forEach((doc, docIndex) => {
          this._addString(doc, docIndex);
        });
      } else {
        this.docs.forEach((doc, docIndex) => {
          this._addObject(doc, docIndex);
        });
      }
      this.norm.clear();
    }
    add(doc) {
      const idx = this.size();
      if (isString(doc)) {
        this._addString(doc, idx);
      } else {
        this._addObject(doc, idx);
      }
    }
    removeAt(idx) {
      this.records.splice(idx, 1);
      for (let i = idx, len = this.size(); i < len; i += 1) {
        this.records[i].i -= 1;
      }
    }
    getValueForItemAtKeyId(item, keyId) {
      return item[this._keysMap[keyId]];
    }
    size() {
      return this.records.length;
    }
    _addString(doc, docIndex) {
      if (!isDefined(doc) || isBlank(doc)) {
        return;
      }
      let record = {
        v: doc,
        i: docIndex,
        n: this.norm.get(doc)
      };
      this.records.push(record);
    }
    _addObject(doc, docIndex) {
      let record = { i: docIndex, $: {} };
      this.keys.forEach((key, keyIndex) => {
        let value = this.getFn(doc, key.path);
        if (!isDefined(value)) {
          return;
        }
        if (isArray(value)) {
          let subRecords = [];
          const stack = [{ nestedArrIndex: -1, value }];
          while (stack.length) {
            const { nestedArrIndex, value: value2 } = stack.pop();
            if (!isDefined(value2)) {
              continue;
            }
            if (isString(value2) && !isBlank(value2)) {
              let subRecord = {
                v: value2,
                i: nestedArrIndex,
                n: this.norm.get(value2)
              };
              subRecords.push(subRecord);
            } else if (isArray(value2)) {
              value2.forEach((item, k) => {
                stack.push({
                  nestedArrIndex: k,
                  value: item
                });
              });
            } else
              ;
          }
          record.$[keyIndex] = subRecords;
        } else if (!isBlank(value)) {
          let subRecord = {
            v: value,
            n: this.norm.get(value)
          };
          record.$[keyIndex] = subRecord;
        }
      });
      this.records.push(record);
    }
    toJSON() {
      return {
        keys: this.keys,
        records: this.records
      };
    }
  };
  function createIndex(keys, docs, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const myIndex = new FuseIndex({ getFn, fieldNormWeight });
    myIndex.setKeys(keys.map(createKey));
    myIndex.setSources(docs);
    myIndex.create();
    return myIndex;
  }
  function parseIndex(data, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const { keys, records } = data;
    const myIndex = new FuseIndex({ getFn, fieldNormWeight });
    myIndex.setKeys(keys);
    myIndex.setIndexRecords(records);
    return myIndex;
  }
  function computeScore$1(pattern, {
    errors = 0,
    currentLocation = 0,
    expectedLocation = 0,
    distance = Config.distance,
    ignoreLocation = Config.ignoreLocation
  } = {}) {
    const accuracy = errors / pattern.length;
    if (ignoreLocation) {
      return accuracy;
    }
    const proximity = Math.abs(expectedLocation - currentLocation);
    if (!distance) {
      return proximity ? 1 : accuracy;
    }
    return accuracy + proximity / distance;
  }
  function convertMaskToIndices(matchmask = [], minMatchCharLength = Config.minMatchCharLength) {
    let indices = [];
    let start = -1;
    let end = -1;
    let i = 0;
    for (let len = matchmask.length; i < len; i += 1) {
      let match = matchmask[i];
      if (match && start === -1) {
        start = i;
      } else if (!match && start !== -1) {
        end = i - 1;
        if (end - start + 1 >= minMatchCharLength) {
          indices.push([start, end]);
        }
        start = -1;
      }
    }
    if (matchmask[i - 1] && i - start >= minMatchCharLength) {
      indices.push([start, i - 1]);
    }
    return indices;
  }
  var MAX_BITS = 32;
  function search(text, pattern, patternAlphabet, {
    location = Config.location,
    distance = Config.distance,
    threshold = Config.threshold,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    includeMatches = Config.includeMatches,
    ignoreLocation = Config.ignoreLocation
  } = {}) {
    if (pattern.length > MAX_BITS) {
      throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
    }
    const patternLen = pattern.length;
    const textLen = text.length;
    const expectedLocation = Math.max(0, Math.min(location, textLen));
    let currentThreshold = threshold;
    let bestLocation = expectedLocation;
    const computeMatches = minMatchCharLength > 1 || includeMatches;
    const matchMask = computeMatches ? Array(textLen) : [];
    let index;
    while ((index = text.indexOf(pattern, bestLocation)) > -1) {
      let score = computeScore$1(pattern, {
        currentLocation: index,
        expectedLocation,
        distance,
        ignoreLocation
      });
      currentThreshold = Math.min(score, currentThreshold);
      bestLocation = index + patternLen;
      if (computeMatches) {
        let i = 0;
        while (i < patternLen) {
          matchMask[index + i] = 1;
          i += 1;
        }
      }
    }
    bestLocation = -1;
    let lastBitArr = [];
    let finalScore = 1;
    let binMax = patternLen + textLen;
    const mask = 1 << patternLen - 1;
    for (let i = 0; i < patternLen; i += 1) {
      let binMin = 0;
      let binMid = binMax;
      while (binMin < binMid) {
        const score2 = computeScore$1(pattern, {
          errors: i,
          currentLocation: expectedLocation + binMid,
          expectedLocation,
          distance,
          ignoreLocation
        });
        if (score2 <= currentThreshold) {
          binMin = binMid;
        } else {
          binMax = binMid;
        }
        binMid = Math.floor((binMax - binMin) / 2 + binMin);
      }
      binMax = binMid;
      let start = Math.max(1, expectedLocation - binMid + 1);
      let finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;
      let bitArr = Array(finish + 2);
      bitArr[finish + 1] = (1 << i) - 1;
      for (let j = finish; j >= start; j -= 1) {
        let currentLocation = j - 1;
        let charMatch = patternAlphabet[text.charAt(currentLocation)];
        if (computeMatches) {
          matchMask[currentLocation] = +!!charMatch;
        }
        bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;
        if (i) {
          bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
        }
        if (bitArr[j] & mask) {
          finalScore = computeScore$1(pattern, {
            errors: i,
            currentLocation,
            expectedLocation,
            distance,
            ignoreLocation
          });
          if (finalScore <= currentThreshold) {
            currentThreshold = finalScore;
            bestLocation = currentLocation;
            if (bestLocation <= expectedLocation) {
              break;
            }
            start = Math.max(1, 2 * expectedLocation - bestLocation);
          }
        }
      }
      const score = computeScore$1(pattern, {
        errors: i + 1,
        currentLocation: expectedLocation,
        expectedLocation,
        distance,
        ignoreLocation
      });
      if (score > currentThreshold) {
        break;
      }
      lastBitArr = bitArr;
    }
    const result = {
      isMatch: bestLocation >= 0,
      score: Math.max(1e-3, finalScore)
    };
    if (computeMatches) {
      const indices = convertMaskToIndices(matchMask, minMatchCharLength);
      if (!indices.length) {
        result.isMatch = false;
      } else if (includeMatches) {
        result.indices = indices;
      }
    }
    return result;
  }
  function createPatternAlphabet(pattern) {
    let mask = {};
    for (let i = 0, len = pattern.length; i < len; i += 1) {
      const char = pattern.charAt(i);
      mask[char] = (mask[char] || 0) | 1 << len - i - 1;
    }
    return mask;
  }
  var BitapSearch = class {
    constructor(pattern, {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}) {
      this.options = {
        location,
        threshold,
        distance,
        includeMatches,
        findAllMatches,
        minMatchCharLength,
        isCaseSensitive,
        ignoreLocation
      };
      this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
      this.chunks = [];
      if (!this.pattern.length) {
        return;
      }
      const addChunk = (pattern2, startIndex) => {
        this.chunks.push({
          pattern: pattern2,
          alphabet: createPatternAlphabet(pattern2),
          startIndex
        });
      };
      const len = this.pattern.length;
      if (len > MAX_BITS) {
        let i = 0;
        const remainder = len % MAX_BITS;
        const end = len - remainder;
        while (i < end) {
          addChunk(this.pattern.substr(i, MAX_BITS), i);
          i += MAX_BITS;
        }
        if (remainder) {
          const startIndex = len - MAX_BITS;
          addChunk(this.pattern.substr(startIndex), startIndex);
        }
      } else {
        addChunk(this.pattern, 0);
      }
    }
    searchIn(text) {
      const { isCaseSensitive, includeMatches } = this.options;
      if (!isCaseSensitive) {
        text = text.toLowerCase();
      }
      if (this.pattern === text) {
        let result2 = {
          isMatch: true,
          score: 0
        };
        if (includeMatches) {
          result2.indices = [[0, text.length - 1]];
        }
        return result2;
      }
      const {
        location,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        ignoreLocation
      } = this.options;
      let allIndices = [];
      let totalScore = 0;
      let hasMatches = false;
      this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
        const { isMatch, score, indices } = search(text, pattern, alphabet, {
          location: location + startIndex,
          distance,
          threshold,
          findAllMatches,
          minMatchCharLength,
          includeMatches,
          ignoreLocation
        });
        if (isMatch) {
          hasMatches = true;
        }
        totalScore += score;
        if (isMatch && indices) {
          allIndices = [...allIndices, ...indices];
        }
      });
      let result = {
        isMatch: hasMatches,
        score: hasMatches ? totalScore / this.chunks.length : 1
      };
      if (hasMatches && includeMatches) {
        result.indices = allIndices;
      }
      return result;
    }
  };
  var BaseMatch = class {
    constructor(pattern) {
      this.pattern = pattern;
    }
    static isMultiMatch(pattern) {
      return getMatch(pattern, this.multiRegex);
    }
    static isSingleMatch(pattern) {
      return getMatch(pattern, this.singleRegex);
    }
    search() {
    }
  };
  function getMatch(pattern, exp) {
    const matches = pattern.match(exp);
    return matches ? matches[1] : null;
  }
  var ExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "exact";
    }
    static get multiRegex() {
      return /^="(.*)"$/;
    }
    static get singleRegex() {
      return /^=(.*)$/;
    }
    search(text) {
      const isMatch = text === this.pattern;
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, this.pattern.length - 1]
      };
    }
  };
  var InverseExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "inverse-exact";
    }
    static get multiRegex() {
      return /^!"(.*)"$/;
    }
    static get singleRegex() {
      return /^!(.*)$/;
    }
    search(text) {
      const index = text.indexOf(this.pattern);
      const isMatch = index === -1;
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, text.length - 1]
      };
    }
  };
  var PrefixExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "prefix-exact";
    }
    static get multiRegex() {
      return /^\^"(.*)"$/;
    }
    static get singleRegex() {
      return /^\^(.*)$/;
    }
    search(text) {
      const isMatch = text.startsWith(this.pattern);
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, this.pattern.length - 1]
      };
    }
  };
  var InversePrefixExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "inverse-prefix-exact";
    }
    static get multiRegex() {
      return /^!\^"(.*)"$/;
    }
    static get singleRegex() {
      return /^!\^(.*)$/;
    }
    search(text) {
      const isMatch = !text.startsWith(this.pattern);
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, text.length - 1]
      };
    }
  };
  var SuffixExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "suffix-exact";
    }
    static get multiRegex() {
      return /^"(.*)"\$$/;
    }
    static get singleRegex() {
      return /^(.*)\$$/;
    }
    search(text) {
      const isMatch = text.endsWith(this.pattern);
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [text.length - this.pattern.length, text.length - 1]
      };
    }
  };
  var InverseSuffixExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "inverse-suffix-exact";
    }
    static get multiRegex() {
      return /^!"(.*)"\$$/;
    }
    static get singleRegex() {
      return /^!(.*)\$$/;
    }
    search(text) {
      const isMatch = !text.endsWith(this.pattern);
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, text.length - 1]
      };
    }
  };
  var FuzzyMatch = class extends BaseMatch {
    constructor(pattern, {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}) {
      super(pattern);
      this._bitapSearch = new BitapSearch(pattern, {
        location,
        threshold,
        distance,
        includeMatches,
        findAllMatches,
        minMatchCharLength,
        isCaseSensitive,
        ignoreLocation
      });
    }
    static get type() {
      return "fuzzy";
    }
    static get multiRegex() {
      return /^"(.*)"$/;
    }
    static get singleRegex() {
      return /^(.*)$/;
    }
    search(text) {
      return this._bitapSearch.searchIn(text);
    }
  };
  var IncludeMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "include";
    }
    static get multiRegex() {
      return /^'"(.*)"$/;
    }
    static get singleRegex() {
      return /^'(.*)$/;
    }
    search(text) {
      let location = 0;
      let index;
      const indices = [];
      const patternLen = this.pattern.length;
      while ((index = text.indexOf(this.pattern, location)) > -1) {
        location = index + patternLen;
        indices.push([index, location - 1]);
      }
      const isMatch = !!indices.length;
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices
      };
    }
  };
  var searchers = [
    ExactMatch,
    IncludeMatch,
    PrefixExactMatch,
    InversePrefixExactMatch,
    InverseSuffixExactMatch,
    SuffixExactMatch,
    InverseExactMatch,
    FuzzyMatch
  ];
  var searchersLen = searchers.length;
  var SPACE_RE = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/;
  var OR_TOKEN = "|";
  function parseQuery(pattern, options = {}) {
    return pattern.split(OR_TOKEN).map((item) => {
      let query = item.trim().split(SPACE_RE).filter((item2) => item2 && !!item2.trim());
      let results = [];
      for (let i = 0, len = query.length; i < len; i += 1) {
        const queryItem = query[i];
        let found = false;
        let idx = -1;
        while (!found && ++idx < searchersLen) {
          const searcher = searchers[idx];
          let token = searcher.isMultiMatch(queryItem);
          if (token) {
            results.push(new searcher(token, options));
            found = true;
          }
        }
        if (found) {
          continue;
        }
        idx = -1;
        while (++idx < searchersLen) {
          const searcher = searchers[idx];
          let token = searcher.isSingleMatch(queryItem);
          if (token) {
            results.push(new searcher(token, options));
            break;
          }
        }
      }
      return results;
    });
  }
  var MultiMatchSet = /* @__PURE__ */ new Set([FuzzyMatch.type, IncludeMatch.type]);
  var ExtendedSearch = class {
    constructor(pattern, {
      isCaseSensitive = Config.isCaseSensitive,
      includeMatches = Config.includeMatches,
      minMatchCharLength = Config.minMatchCharLength,
      ignoreLocation = Config.ignoreLocation,
      findAllMatches = Config.findAllMatches,
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance
    } = {}) {
      this.query = null;
      this.options = {
        isCaseSensitive,
        includeMatches,
        minMatchCharLength,
        findAllMatches,
        ignoreLocation,
        location,
        threshold,
        distance
      };
      this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
      this.query = parseQuery(this.pattern, this.options);
    }
    static condition(_, options) {
      return options.useExtendedSearch;
    }
    searchIn(text) {
      const query = this.query;
      if (!query) {
        return {
          isMatch: false,
          score: 1
        };
      }
      const { includeMatches, isCaseSensitive } = this.options;
      text = isCaseSensitive ? text : text.toLowerCase();
      let numMatches = 0;
      let allIndices = [];
      let totalScore = 0;
      for (let i = 0, qLen = query.length; i < qLen; i += 1) {
        const searchers2 = query[i];
        allIndices.length = 0;
        numMatches = 0;
        for (let j = 0, pLen = searchers2.length; j < pLen; j += 1) {
          const searcher = searchers2[j];
          const { isMatch, indices, score } = searcher.search(text);
          if (isMatch) {
            numMatches += 1;
            totalScore += score;
            if (includeMatches) {
              const type = searcher.constructor.type;
              if (MultiMatchSet.has(type)) {
                allIndices = [...allIndices, ...indices];
              } else {
                allIndices.push(indices);
              }
            }
          } else {
            totalScore = 0;
            numMatches = 0;
            allIndices.length = 0;
            break;
          }
        }
        if (numMatches) {
          let result = {
            isMatch: true,
            score: totalScore / numMatches
          };
          if (includeMatches) {
            result.indices = allIndices;
          }
          return result;
        }
      }
      return {
        isMatch: false,
        score: 1
      };
    }
  };
  var registeredSearchers = [];
  function register(...args) {
    registeredSearchers.push(...args);
  }
  function createSearcher(pattern, options) {
    for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
      let searcherClass = registeredSearchers[i];
      if (searcherClass.condition(pattern, options)) {
        return new searcherClass(pattern, options);
      }
    }
    return new BitapSearch(pattern, options);
  }
  var LogicalOperator = {
    AND: "$and",
    OR: "$or"
  };
  var KeyType = {
    PATH: "$path",
    PATTERN: "$val"
  };
  var isExpression = (query) => !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
  var isPath = (query) => !!query[KeyType.PATH];
  var isLeaf = (query) => !isArray(query) && isObject(query) && !isExpression(query);
  var convertToExplicit = (query) => ({
    [LogicalOperator.AND]: Object.keys(query).map((key) => ({
      [key]: query[key]
    }))
  });
  function parse(query, options, { auto = true } = {}) {
    const next = (query2) => {
      let keys = Object.keys(query2);
      const isQueryPath = isPath(query2);
      if (!isQueryPath && keys.length > 1 && !isExpression(query2)) {
        return next(convertToExplicit(query2));
      }
      if (isLeaf(query2)) {
        const key = isQueryPath ? query2[KeyType.PATH] : keys[0];
        const pattern = isQueryPath ? query2[KeyType.PATTERN] : query2[key];
        if (!isString(pattern)) {
          throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
        }
        const obj = {
          keyId: createKeyId(key),
          pattern
        };
        if (auto) {
          obj.searcher = createSearcher(pattern, options);
        }
        return obj;
      }
      let node = {
        children: [],
        operator: keys[0]
      };
      keys.forEach((key) => {
        const value = query2[key];
        if (isArray(value)) {
          value.forEach((item) => {
            node.children.push(next(item));
          });
        }
      });
      return node;
    };
    if (!isExpression(query)) {
      query = convertToExplicit(query);
    }
    return next(query);
  }
  function computeScore(results, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
    results.forEach((result) => {
      let totalScore = 1;
      result.matches.forEach(({ key, norm: norm2, score }) => {
        const weight = key ? key.weight : null;
        totalScore *= Math.pow(score === 0 && weight ? Number.EPSILON : score, (weight || 1) * (ignoreFieldNorm ? 1 : norm2));
      });
      result.score = totalScore;
    });
  }
  function transformMatches(result, data) {
    const matches = result.matches;
    data.matches = [];
    if (!isDefined(matches)) {
      return;
    }
    matches.forEach((match) => {
      if (!isDefined(match.indices) || !match.indices.length) {
        return;
      }
      const { indices, value } = match;
      let obj = {
        indices,
        value
      };
      if (match.key) {
        obj.key = match.key.src;
      }
      if (match.idx > -1) {
        obj.refIndex = match.idx;
      }
      data.matches.push(obj);
    });
  }
  function transformScore(result, data) {
    data.score = result.score;
  }
  function format(results, docs, {
    includeMatches = Config.includeMatches,
    includeScore = Config.includeScore
  } = {}) {
    const transformers = [];
    if (includeMatches)
      transformers.push(transformMatches);
    if (includeScore)
      transformers.push(transformScore);
    return results.map((result) => {
      const { idx } = result;
      const data = {
        item: docs[idx],
        refIndex: idx
      };
      if (transformers.length) {
        transformers.forEach((transformer) => {
          transformer(result, data);
        });
      }
      return data;
    });
  }
  var Fuse = class {
    constructor(docs, options = {}, index) {
      this.options = __spreadValues(__spreadValues({}, Config), options);
      if (this.options.useExtendedSearch && false) {
        throw new Error(EXTENDED_SEARCH_UNAVAILABLE);
      }
      this._keyStore = new KeyStore(this.options.keys);
      this.setCollection(docs, index);
    }
    setCollection(docs, index) {
      this._docs = docs;
      if (index && !(index instanceof FuseIndex)) {
        throw new Error(INCORRECT_INDEX_TYPE);
      }
      this._myIndex = index || createIndex(this.options.keys, this._docs, {
        getFn: this.options.getFn,
        fieldNormWeight: this.options.fieldNormWeight
      });
    }
    add(doc) {
      if (!isDefined(doc)) {
        return;
      }
      this._docs.push(doc);
      this._myIndex.add(doc);
    }
    remove(predicate = () => false) {
      const results = [];
      for (let i = 0, len = this._docs.length; i < len; i += 1) {
        const doc = this._docs[i];
        if (predicate(doc, i)) {
          this.removeAt(i);
          i -= 1;
          len -= 1;
          results.push(doc);
        }
      }
      return results;
    }
    removeAt(idx) {
      this._docs.splice(idx, 1);
      this._myIndex.removeAt(idx);
    }
    getIndex() {
      return this._myIndex;
    }
    search(query, { limit = -1 } = {}) {
      const {
        includeMatches,
        includeScore,
        shouldSort,
        sortFn,
        ignoreFieldNorm
      } = this.options;
      let results = isString(query) ? isString(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
      computeScore(results, { ignoreFieldNorm });
      if (shouldSort) {
        results.sort(sortFn);
      }
      if (isNumber(limit) && limit > -1) {
        results = results.slice(0, limit);
      }
      return format(results, this._docs, {
        includeMatches,
        includeScore
      });
    }
    _searchStringList(query) {
      const searcher = createSearcher(query, this.options);
      const { records } = this._myIndex;
      const results = [];
      records.forEach(({ v: text, i: idx, n: norm2 }) => {
        if (!isDefined(text)) {
          return;
        }
        const { isMatch, score, indices } = searcher.searchIn(text);
        if (isMatch) {
          results.push({
            item: text,
            idx,
            matches: [{ score, value: text, norm: norm2, indices }]
          });
        }
      });
      return results;
    }
    _searchLogical(query) {
      const expression = parse(query, this.options);
      const evaluate = (node, item, idx) => {
        if (!node.children) {
          const { keyId, searcher } = node;
          const matches = this._findMatches({
            key: this._keyStore.get(keyId),
            value: this._myIndex.getValueForItemAtKeyId(item, keyId),
            searcher
          });
          if (matches && matches.length) {
            return [
              {
                idx,
                item,
                matches
              }
            ];
          }
          return [];
        }
        const res = [];
        for (let i = 0, len = node.children.length; i < len; i += 1) {
          const child = node.children[i];
          const result = evaluate(child, item, idx);
          if (result.length) {
            res.push(...result);
          } else if (node.operator === LogicalOperator.AND) {
            return [];
          }
        }
        return res;
      };
      const records = this._myIndex.records;
      const resultMap = {};
      const results = [];
      records.forEach(({ $: item, i: idx }) => {
        if (isDefined(item)) {
          let expResults = evaluate(expression, item, idx);
          if (expResults.length) {
            if (!resultMap[idx]) {
              resultMap[idx] = { idx, item, matches: [] };
              results.push(resultMap[idx]);
            }
            expResults.forEach(({ matches }) => {
              resultMap[idx].matches.push(...matches);
            });
          }
        }
      });
      return results;
    }
    _searchObjectList(query) {
      const searcher = createSearcher(query, this.options);
      const { keys, records } = this._myIndex;
      const results = [];
      records.forEach(({ $: item, i: idx }) => {
        if (!isDefined(item)) {
          return;
        }
        let matches = [];
        keys.forEach((key, keyIndex) => {
          matches.push(...this._findMatches({
            key,
            value: item[keyIndex],
            searcher
          }));
        });
        if (matches.length) {
          results.push({
            idx,
            item,
            matches
          });
        }
      });
      return results;
    }
    _findMatches({ key, value, searcher }) {
      if (!isDefined(value)) {
        return [];
      }
      let matches = [];
      if (isArray(value)) {
        value.forEach(({ v: text, i: idx, n: norm2 }) => {
          if (!isDefined(text)) {
            return;
          }
          const { isMatch, score, indices } = searcher.searchIn(text);
          if (isMatch) {
            matches.push({
              score,
              key,
              value: text,
              idx,
              norm: norm2,
              indices
            });
          }
        });
      } else {
        const { v: text, n: norm2 } = value;
        const { isMatch, score, indices } = searcher.searchIn(text);
        if (isMatch) {
          matches.push({ score, key, value: text, norm: norm2, indices });
        }
      }
      return matches;
    }
  };
  Fuse.version = "6.5.3";
  Fuse.createIndex = createIndex;
  Fuse.parseIndex = parseIndex;
  Fuse.config = Config;
  {
    Fuse.parseQuery = parse;
  }
  {
    register(ExtendedSearch);
  }

  // src/ts/listeners/helpers/safe-get-element-by-id.ts
  var safeGetElementById = (id) => {
    const element = document.getElementById(id);
    if (!(element instanceof HTMLElement)) {
      throw new Error("Element is unexpectedly missing");
    }
    return element;
  };

  // src/ts/listeners/helpers/search-results-actions.ts
  var showSearchResults = () => {
    const searchResultsElement = safeGetElementById("search-results");
    searchResultsElement.classList.remove("hidden");
  };
  var hideSearchResults = () => {
    const searchResultsElement = safeGetElementById("search-results");
    searchResultsElement.classList.add("hidden");
  };
  var clearSearchResults = () => {
    const searchResultsElement = safeGetElementById("search-results");
    searchResultsElement.innerHTML = "";
  };
  var createNoResultElement = () => {
    const searchResultsElement = safeGetElementById("search-results");
    searchResultsElement.insertAdjacentHTML("beforeend", `<div class="p-2 w-full"><p>No Results</p></div>`);
  };
  var boldIndices = (name, indices) => {
    let result = "";
    let position = 0;
    indices.forEach(([from, to], index) => {
      result += name.substring(position, from);
      position = to + 1;
      const replaceTarget = name.substring(from, to + 1);
      const replacement = `<span class="text-gray-800 font-bold">${replaceTarget}</span>`;
      result += replacement;
      if (index === indices.length - 1) {
        result += name.substring(to + 1, name.length);
      }
    });
    return result;
  };
  var createSearchResult = (item, indices) => {
    const { name, slug, type } = item;
    const resultHref = `/${type}/${slug}/`;
    const resultLinkClasses = "flex flex-col p-2 hover:bg-gray-300 cursor-pointer focus-visible:bg-gray-200 focus-visible:text-gray-800";
    const nameElement = `<p class="w-3/4">${boldIndices(name, indices)}</p>`;
    const typeElement = `<p class="w-1/4 opacity-50 text-right">${type}</p>`;
    const resultWrapper = `<div class="flex flex-row">${nameElement}${typeElement}</div>`;
    return `<a href="${resultHref}" tabindex="0" class="${resultLinkClasses}">${resultWrapper}</a>`;
  };
  var insertSearchResults = (searchResultsHtml) => {
    const searchResultsElement = safeGetElementById("search-results");
    searchResultsElement.insertAdjacentHTML("beforeend", searchResultsHtml);
  };
  var FOCUSSED_RESULT = "focussed-result";
  var FOCUS_CLASSES = [FOCUSSED_RESULT, "bg-gray-200", "text-gray-800"];
  var getFocussedResultIndex = () => {
    const { children } = safeGetElementById("search-results");
    for (let i = 0; i < children.length; i++) {
      if (children[i]) {
        const element = children[i];
        if (element.classList.contains(FOCUSSED_RESULT)) {
          return i;
        }
      }
    }
    throw new Error("Focussed Result index is missing");
  };
  var getFocussedResultHref = () => {
    const { children } = safeGetElementById("search-results");
    for (let i = 0; i < children.length; i++) {
      if (children[i]) {
        const element = children[i];
        if (element.classList.contains(FOCUSSED_RESULT)) {
          const href = element.getAttribute("href");
          if (typeof href === "string") {
            return href;
          }
        }
      }
    }
    throw new Error("Focussed Result href is missing");
  };
  var unSetFocussedResult = (resultIndex) => {
    const {
      children: { [resultIndex]: searchResult }
    } = safeGetElementById("search-results");
    if (searchResult) {
      searchResult.classList.remove(...FOCUS_CLASSES);
    }
  };
  var setFocussedResult = (resultIndex) => {
    const { children } = safeGetElementById("search-results");
    const lastIndex = children.length - 1;
    if (resultIndex > lastIndex) {
      const element2 = children[0];
      element2.classList.add(...FOCUS_CLASSES);
      return;
    }
    if (resultIndex < 0) {
      const element2 = children[lastIndex];
      element2.classList.add(...FOCUS_CLASSES);
      return;
    }
    const element = children[resultIndex];
    element.classList.add(...FOCUS_CLASSES);
  };

  // src/ts/listeners/helpers/element-dimensions.ts
  var getElementNaturalDimensions = (element) => {
    const { naturalHeight, naturalWidth } = element;
    return {
      naturalHeight,
      naturalWidth
    };
  };
  var getElementRealDimensions = (element) => {
    const { width, height, top, left } = element.getBoundingClientRect();
    return {
      width,
      height,
      top,
      left
    };
  };
  var getElementPaddings = (element) => {
    const leftPadding = parseInt(window.getComputedStyle(element).getPropertyValue("padding-left").replace("px", ""));
    const rightPadding = parseInt(window.getComputedStyle(element).getPropertyValue("padding-top").replace("px", ""));
    const topPadding = parseInt(window.getComputedStyle(element).getPropertyValue("padding-top").replace("px", ""));
    const bottomPadding = parseInt(window.getComputedStyle(element).getPropertyValue("padding-top").replace("px", ""));
    return {
      leftPadding,
      rightPadding,
      topPadding,
      bottomPadding
    };
  };

  // src/ts/listeners/helpers/extract-map-id.ts
  var extractMapId = (elementIdString) => {
    const lastKebabCaseItem = elementIdString.split("-").slice(-1);
    if (lastKebabCaseItem[0]) {
      return lastKebabCaseItem[0];
    }
    throw new Error("Map ID not found");
  };

  // src/ts/listeners/helpers/place-marker.ts
  var placeVisibleMarker = () => {
    if (document.querySelectorAll('[id^="map-marker-"]').length === 0) {
      return;
    }
    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');
    if (!(visibleImageWrapper instanceof HTMLDivElement)) {
      throw new Error("Imagewrapper element is missing");
    }
    const mapId = extractMapId(visibleImageWrapper.id);
    placeMarker(mapId);
  };
  var placeMarker = (mapId) => {
    const mapImageWrapperElement = document.getElementById(`map-imagewrapper-${mapId}`);
    const mapImageElement = document.getElementById(`map-image-${mapId}`);
    const mapMarkerElement = document.getElementById(`map-marker-${mapId}`);
    if (!(mapImageWrapperElement instanceof HTMLDivElement)) {
      throw new Error(`Imagewrapper for mapId ${mapId} is missing`);
    }
    if (!(mapImageElement instanceof HTMLImageElement)) {
      throw new Error(`Image for mapId ${mapId} is missing`);
    }
    if (!(mapMarkerElement instanceof HTMLImageElement)) {
      throw new Error(`Marker icon for mapId ${mapId} is missing`);
    }
    const mapNaturalDimensions = getElementNaturalDimensions(mapImageElement);
    const mapRealDimensions = getElementRealDimensions(mapImageElement);
    const markerRealDimensions = getElementRealDimensions(mapMarkerElement);
    const { leftPadding, topPadding } = getElementPaddings(mapImageWrapperElement);
    const { markerx, markery } = mapMarkerElement.dataset;
    if (!markerx || !markery) {
      throw new Error("Marker coordinates not provided");
    }
    const markerRelativeX = Math.round(parseInt(markerx) * mapRealDimensions.width / mapNaturalDimensions.naturalWidth - markerRealDimensions.width / 2) + leftPadding;
    const markerRelativeY = Math.round(parseInt(markery) * mapRealDimensions.height / mapNaturalDimensions.naturalHeight - markerRealDimensions.height) + topPadding;
    mapMarkerElement.style.top = `${markerRelativeY}px`;
    mapMarkerElement.style.left = `${markerRelativeX}px`;
    mapMarkerElement.classList.replace("opacity-0", "opacity-80");
  };

  // src/ts/listeners/helpers/set-transform-origin.ts
  var setVisibleMapTransformOrigin = () => {
    const visibleImageWrapper = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden)');
    if (!(visibleImageWrapper instanceof HTMLDivElement)) {
      throw new Error("Imagewrapper element is missing");
    }
    const { top, left } = getElementRealDimensions(visibleImageWrapper);
    visibleImageWrapper.style.transformOrigin = `${-left}px ${-top}px`;
  };

  // src/ts/listeners/handlers/search-input.ts
  var fuse = new Fuse([], {
    includeMatches: true,
    keys: ["name"]
  });
  (() => __async(void 0, null, function* () {
    const resp = yield fetch("/data.json");
    const data = yield resp.json();
    fuse.setCollection(data);
  }))();
  var searchInputHandler = (event) => {
    clearSearchResults();
    const { value } = event.target;
    if (value.length === 0) {
      hideSearchResults();
      return;
    }
    const results = fuse.search(value).slice(0, 9);
    if (results.length === 0) {
      createNoResultElement();
      return;
    }
    const resultElementsHtml = results.map((result) => {
      const { item, matches } = result;
      if (!matches || !matches[0]) {
        throw new Error("Matching indices missing in fuse result object");
      }
      const indices = matches[0].indices;
      return createSearchResult(item, indices);
    }).join("");
    insertSearchResults(resultElementsHtml);
    showSearchResults();
    setFocussedResult(0);
  };

  // src/ts/listeners/handlers/search-keys.ts
  var searchKeysHandler = (event) => {
    const { key } = event;
    if (key === "ArrowDown") {
      event.preventDefault();
      const focusIndex = getFocussedResultIndex();
      unSetFocussedResult(focusIndex);
      setFocussedResult(focusIndex + 1);
    }
    if (key === "ArrowUp") {
      event.preventDefault();
      const focusIndex = getFocussedResultIndex();
      unSetFocussedResult(focusIndex);
      setFocussedResult(focusIndex - 1);
    }
    if (key === "Enter") {
      event.preventDefault();
      const focusHref = getFocussedResultHref();
      window.location.href = focusHref;
    }
    if (key === "Tab") {
      const focusIndex = getFocussedResultIndex();
      unSetFocussedResult(focusIndex);
    }
  };

  // src/ts/listeners/handlers/search-focusout.ts
  var searchFocusoutHandler = (event) => {
    const relatedTarget = event.relatedTarget;
    if (relatedTarget === null) {
      hideSearchResults();
    }
    if (relatedTarget instanceof HTMLElement && !relatedTarget.matches("#search-wrapper *")) {
      hideSearchResults();
    }
  };

  // src/ts/listeners/handlers/map-zoom-and-pan.ts
  var clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  var showResetZoomButton = () => {
    const resetButton = document.getElementById("reset-zoom-button");
    if (!resetButton) {
      throw new Error("Reset button is missing");
    }
    resetButton.classList.add("flex");
    resetButton.classList.remove("hidden");
  };
  var hideResetZoomButton = () => {
    const resetButton = document.getElementById("reset-zoom-button");
    if (!resetButton) {
      throw new Error("Reset button is missing");
    }
    resetButton.classList.add("hidden");
    resetButton.classList.remove("flex");
  };
  var setZoomAndPanListeners = () => {
    const imageWrappers = document.querySelectorAll("[id^=map-imagewrapper-]");
    imageWrappers.forEach((imageWrapper) => {
      if (!(imageWrapper instanceof HTMLDivElement)) {
        throw new Error("element with `map-imagewrapper-` id is not a div element");
      }
      let activeTransform = false;
      let panning = false;
      let scale = 1;
      let pointX = 0;
      let pointY = 0;
      let startX = 0;
      let startY = 0;
      const setTransform = () => {
        imageWrapper.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
      };
      imageWrapper.onmousedown = (event) => {
        event.preventDefault();
        const { clientX, clientY, buttons } = event;
        if (buttons !== 1 && buttons !== 4) {
          return;
        }
        startX = clientX - pointX;
        startY = clientY - pointY;
        panning = true;
        imageWrapper.style.cursor = "grabbing";
      };
      imageWrapper.onmouseup = () => {
        panning = false;
        imageWrapper.style.cursor = "grab";
      };
      imageWrapper.onmousemove = (event) => {
        event.preventDefault();
        if (!panning) {
          return;
        }
        if (!activeTransform) {
          showResetZoomButton();
          activeTransform = true;
        }
        const { clientX, clientY } = event;
        pointX = clientX - startX;
        pointY = clientY - startY;
        setTransform();
      };
      imageWrapper.onwheel = (event) => {
        event.preventDefault();
        if (!activeTransform) {
          showResetZoomButton();
          activeTransform = true;
        }
        const { clientX, clientY, deltaY } = event;
        const xs = (clientX - pointX) / scale;
        const ys = (clientY - pointY) / scale;
        const delta = -deltaY;
        const maxWheelDown = 6;
        const maxWheelUp = 1;
        const scaleFactor = 1.2;
        if (delta > 0) {
          scale = clamp(scale * scaleFactor, 1 / __pow(scaleFactor, maxWheelUp), __pow(scaleFactor, maxWheelDown));
        } else {
          scale = clamp(scale / scaleFactor, 1 / __pow(scaleFactor, maxWheelUp), __pow(scaleFactor, maxWheelDown));
        }
        pointX = clientX - xs * scale;
        pointY = clientY - ys * scale;
        setTransform();
      };
      const reset = () => {
        panning = false;
        scale = 1;
        pointX = 0;
        pointY = 0;
        startX = 0;
        startY = 0;
        setTransform();
        hideResetZoomButton();
        activeTransform = false;
      };
      window.addEventListener("resize", () => {
        reset();
        setVisibleMapTransformOrigin();
      });
      const mapButtons = document.querySelectorAll('input[name="map-selector"]');
      mapButtons.forEach((element) => {
        element.addEventListener("change", reset);
      });
      const resetButton = document.getElementById("reset-zoom-button");
      if (!resetButton) {
        throw new Error("Reset button is missing");
      }
      resetButton.addEventListener("click", reset);
    });
  };

  // src/ts/listeners/handlers/map-map-selectors.ts
  var handleMapSelectorChange = (event) => {
    const target = event.target;
    const mapId = extractMapId(target.id);
    const mapWrappers = document.querySelectorAll("[id^=map-imagewrapper-]");
    mapWrappers.forEach((mapWrapper) => {
      if (!mapWrapper.classList.contains("hidden")) {
        mapWrapper.classList.add("hidden");
      }
    });
    const selectedImageWrapper = document.getElementById(`map-imagewrapper-${mapId}`);
    if (!(selectedImageWrapper instanceof HTMLElement)) {
      throw new Error("Imagewrapper for selected map is missing");
    }
    selectedImageWrapper.classList.remove("hidden");
    setVisibleMapTransformOrigin();
    placeVisibleMarker();
  };
  var setMapSelectorListeners = () => {
    const mapButtons = document.querySelectorAll('input[name="map-selector"]');
    const mapButtonSpans = document.querySelectorAll('input[name="map-selector"]~span');
    mapButtons.forEach((element) => {
      if (!(element instanceof HTMLInputElement)) {
        throw new Error("Map Input has unexpected type");
      }
      element.addEventListener("change", (event) => {
        handleMapSelectorChange(event);
      });
    });
    mapButtonSpans.forEach((element) => {
      if (!(element instanceof HTMLSpanElement)) {
        throw new Error("Map button has unexpected type");
      }
      element.addEventListener("keydown", (event) => {
        const { key } = event;
        if (key === "Enter") {
          const inputSibling = element.previousElementSibling;
          if (!(inputSibling instanceof HTMLInputElement)) {
            throw new Error("Map Button input element missing");
          }
          inputSibling.checked = true;
          const changeEvent = new Event("change");
          inputSibling.dispatchEvent(changeEvent);
        }
      });
    });
  };

  // src/ts/listeners/search-listeners.ts
  var setSearchListeners = () => {
    const searchInputElement = document.getElementById("search");
    if (!(searchInputElement instanceof HTMLElement)) {
      return;
    }
    searchInputElement.addEventListener("input", searchInputHandler);
    searchInputElement.addEventListener("focus", searchInputHandler);
    searchInputElement.addEventListener("keydown", searchKeysHandler);
    const searchWrapperElement = safeGetElementById("search-wrapper");
    searchWrapperElement.addEventListener("focusout", searchFocusoutHandler);
  };

  // src/ts/listeners/map-listeners.ts
  var setListeners = () => {
    setVisibleMapTransformOrigin();
    setZoomAndPanListeners();
    setMapSelectorListeners();
    placeVisibleMarker();
    window.addEventListener("resize", () => {
      placeVisibleMarker();
    });
  };
  var setMapListeners = () => {
    const visibleImage = document.querySelector('[id^="map-imagewrapper-"]:not(.hidden) [id^="map-image-"');
    if (!(visibleImage instanceof HTMLImageElement)) {
      return;
    }
    if (visibleImage.complete) {
      setListeners();
      return;
    }
    visibleImage.addEventListener("load", () => {
      setListeners();
    });
  };

  // src/ts/main.ts
  var setListeners2 = () => {
    setErrorListener();
    setLoadListener();
    setSearchListeners();
    setMapListeners();
  };
  if (document.readyState !== "loading") {
    setListeners2();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      setListeners2();
    });
  }
})();
//# sourceMappingURL=main.js.map
