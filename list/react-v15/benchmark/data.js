var testData = {
  "S1": [
    {
      "_index": 0
    },
    {
      "_index": 1
    },
    {
      "_index": 2
    },
    {
      "_index": 3
    },
    {
      "_index": 4
    },
    {
      "_index": 5
    },
    {
      "_index": 6
    },
    {
      "_index": 7
    },
    {
      "_index": 8
    },
    {
      "_index": 9
    }
  ],
  "S2": [
    {
      "_index": 3
    },
    {
      "_index": 1
    },
    {
      "_index": 5
    },
    {
      "_index": 2
    },
    {
      "_index": 8
    },
    {
      "_index": 4
    },
    {
      "_index": 6
    },
    {
      "_index": 7
    },
    {
      "_index": 9
    },
    {
      "_index": 0
    }
  ],
  "best": {
    "1": {
      "_index": 1
    },
    "2": {
      "_index": 2
    },
    "4": {
      "_index": 4
    },
    "6": {
      "_index": 6
    },
    "7": {
      "_index": 7
    },
    "9": {
      "_index": 9
    }
  },
  "first": {
    "3": {
      "_index": 3
    },
    "5": {
      "_index": 5
    },
    "8": {
      "_index": 8
    },
    "9": {
      "_index": 9
    }
  }
}

// 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
// 3, 1, 5, 2, 8, 4, 6, 7, 9, 0
// best: 1, 2, 4, 6, 7, 9, move: 4
// first: 3, 5, 8, 9, move: 6

/*
0, 1, 2, 3, 4, 5, 6, 7, 8, 9
3移到0前面
3, 0, 1, 2, 4, 5, 6, 7, 8, 9
5移到2前面
3 0 1 5 2 4 6 7 8 9
3 0 1 5 2 8 4 6 7 9

*/
