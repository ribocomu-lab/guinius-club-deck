// 자동 생성: scripts/analysis/2026-10-23_build-deck-data.py — 직접 고치지 말고 스크립트를 다시 실행하세요.
window.DECK_DATA = {
 "ai": {
  "val_n": 20,
  "val_correct": 17,
  "val_acc": 0.85,
  "ci_lo": 0.64,
  "ci_hi": 0.948,
  "train_n": 80,
  "train_correct": 80,
  "train_acc": 1.0,
  "total": 100,
  "per_class": 50,
  "sources": {
   "pexels": 90,
   "unsplash": 10
  },
  "cm": {
   "guinea_pig->guinea_pig": 9,
   "guinea_pig->hamster": 1,
   "hamster->guinea_pig": 2,
   "hamster->hamster": 8
  },
  "val_conf_correct": 0.971,
  "val_conf_wrong": 0.77,
  "wrong": [
   {
    "file": "hamster_044.jpg",
    "true": "hamster",
    "pred": "guinea_pig",
    "conf": 0.9644,
    "url": "https://images.pexels.com/photos/18962354/pexels-photo-18962354/free-photo-of-woman-in-shirt-sitting-and-holding-hamster.jpeg?auto=compress&cs=tinysrgb&w=640",
    "alt": "Free Young woman with long hair holding a white hamster while sitting indoors in a red plaid shirt. Stock Photo"
   },
   {
    "file": "hamster_028.jpg",
    "true": "hamster",
    "pred": "guinea_pig",
    "conf": 0.7751,
    "url": "https://images.unsplash.com/photo-1778347108338-eea3ebf3d6a8?fm=jpg&q=80&w=640&fit=max",
    "alt": "A small hamster peeks out from a round opening"
   },
   {
    "file": "guinea_pig_008.jpg",
    "true": "guinea_pig",
    "pred": "hamster",
    "conf": 0.5692,
    "url": "https://images.pexels.com/photos/27083325/pexels-photo-27083325/free-photo-of-brazilian-guinea-pig-in-nature.jpeg?auto=compress&cs=tinysrgb&w=640",
    "alt": "Free Close-up of a wild guinea pig in Guatavita, Colombia, exploring the vibrant grasslands. Stock Photo"
   }
  ],
  "shaky": [
   {
    "file": "hamster_009.jpg",
    "true": "hamster",
    "pred": "hamster",
    "conf": 0.7419,
    "url": "https://images.unsplash.com/photo-1676918555382-fcd06a483e25?fm=jpg&q=80&w=640&fit=max",
    "alt": "a hamster in a house with a pine cone"
   },
   {
    "file": "hamster_020.jpg",
    "true": "hamster",
    "pred": "hamster",
    "conf": 0.8933,
    "url": "https://images.pexels.com/photos/28749492/pexels-photo-28749492/free-photo-of-adorable-syrian-hamster-on-dark-background.jpeg?auto=compress&cs=tinysrgb&w=640",
    "alt": "Free Cute white Syrian hamster posing in a studio setting. Perfect for pet enthusiasts. Stock Photo"
   }
  ],
  "val_points": [
   {
    "file": "guinea_pig_008.jpg",
    "true": "guinea_pig",
    "ok": false,
    "p_true": 0.4308
   },
   {
    "file": "guinea_pig_011.jpg",
    "true": "guinea_pig",
    "ok": true,
    "p_true": 0.9969
   },
   {
    "file": "guinea_pig_015.jpg",
    "true": "guinea_pig",
    "ok": true,
    "p_true": 0.9985
   },
   {
    "file": "guinea_pig_019.jpg",
    "true": "guinea_pig",
    "ok": true,
    "p_true": 0.9897
   },
   {
    "file": "guinea_pig_021.jpg",
    "true": "guinea_pig",
    "ok": true,
    "p_true": 0.9976
   },
   {
    "file": "guinea_pig_023.jpg",
    "true": "guinea_pig",
    "ok": true,
    "p_true": 0.9997
   },
   {
    "file": "guinea_pig_029.jpg",
    "true": "guinea_pig",
    "ok": true,
    "p_true": 0.9998
   },
   {
    "file": "guinea_pig_039.jpg",
    "true": "guinea_pig",
    "ok": true,
    "p_true": 1.0
   },
   {
    "file": "guinea_pig_043.jpg",
    "true": "guinea_pig",
    "ok": true,
    "p_true": 0.999
   },
   {
    "file": "guinea_pig_050.jpg",
    "true": "guinea_pig",
    "ok": true,
    "p_true": 0.9996
   },
   {
    "file": "hamster_002.jpg",
    "true": "hamster",
    "ok": true,
    "p_true": 0.9892
   },
   {
    "file": "hamster_007.jpg",
    "true": "hamster",
    "ok": true,
    "p_true": 0.9413
   },
   {
    "file": "hamster_008.jpg",
    "true": "hamster",
    "ok": true,
    "p_true": 0.9981
   },
   {
    "file": "hamster_009.jpg",
    "true": "hamster",
    "ok": true,
    "p_true": 0.7419
   },
   {
    "file": "hamster_014.jpg",
    "true": "hamster",
    "ok": true,
    "p_true": 0.9963
   },
   {
    "file": "hamster_020.jpg",
    "true": "hamster",
    "ok": true,
    "p_true": 0.8933
   },
   {
    "file": "hamster_026.jpg",
    "true": "hamster",
    "ok": true,
    "p_true": 0.9996
   },
   {
    "file": "hamster_028.jpg",
    "true": "hamster",
    "ok": false,
    "p_true": 0.2249
   },
   {
    "file": "hamster_035.jpg",
    "true": "hamster",
    "ok": true,
    "p_true": 0.9612
   },
   {
    "file": "hamster_044.jpg",
    "true": "hamster",
    "ok": false,
    "p_true": 0.0356
   }
  ],
  "recall": {
   "guinea_pig": 0.9,
   "hamster": 0.8
  },
  "split_by_class": {
   "guinea_pig|train": 40,
   "guinea_pig|val": 10,
   "hamster|train": 40,
   "hamster|val": 10
  }
 },
 "care": {
  "posts": 47,
  "neg": 27,
  "neg_pct": 57.4,
  "top_cat": "질병/동물병원",
  "top_cat_pct": 34.0,
  "bond_neg_pct": 77.8,
  "top_kw": "vet",
  "top_kw_n": 51,
  "sentiment": {
   "부정": 27,
   "중립": 12,
   "긍정": 8
  },
  "categories": [
   {
    "name": "질병/동물병원",
    "n": 16,
    "pct": 34.0,
    "neg_pct": 68.8
   },
   {
    "name": "케이지/환경",
    "n": 10,
    "pct": 21.3,
    "neg_pct": 20.0
   },
   {
    "name": "행동/합사",
    "n": 9,
    "pct": 19.1,
    "neg_pct": 77.8
   },
   {
    "name": "식단/건초",
    "n": 8,
    "pct": 17.0,
    "neg_pct": 62.5
   },
   {
    "name": "입양/비용/책임",
    "n": 3,
    "pct": 6.4,
    "neg_pct": 33.3
   },
   {
    "name": "위생/일상관리",
    "n": 1,
    "pct": 2.1,
    "neg_pct": 100.0
   }
  ],
  "keywords": [
   {
    "word": "vet",
    "ko": "동물병원",
    "n": 51
   },
   {
    "word": "cage",
    "ko": "케이지",
    "n": 48
   },
   {
    "word": "hay",
    "ko": "건초",
    "n": 33
   },
   {
    "word": "eat",
    "ko": "먹다/식욕",
    "n": 29
   },
   {
    "word": "feed",
    "ko": "먹이주기",
    "n": 24
   },
   {
    "word": "veggie",
    "ko": "채소",
    "n": 23
   },
   {
    "word": "worry",
    "ko": "걱정",
    "n": 17
   },
   {
    "word": "food",
    "ko": "사료/음식",
    "n": 16
   }
  ]
 },
 "joy": {
  "threads": 44,
  "paragraphs": 931,
  "popcorn_paragraphs": 140,
  "wheek_paragraphs": 123,
  "triggers": [
   {
    "ko": "간식·채소 시간",
    "n": 25,
    "intense": 11
   },
   {
    "ko": "청소·새 베딩",
    "n": 24,
    "intense": 8
   },
   {
    "ko": "친구 기니피그·서열놀이",
    "n": 22,
    "intense": 7
   },
   {
    "ko": "방목·플로어타임",
    "n": 19,
    "intense": 8
   },
   {
    "ko": "장난감·은신처",
    "n": 18,
    "intense": 9
   },
   {
    "ko": "신선한 건초",
    "n": 17,
    "intense": 9
   }
  ],
  "wheek_all": [
   {
    "ko": "밥 시간 알람(배꼽시계)",
    "n": 21
   },
   {
    "ko": "비닐·건초봉지 바스락",
    "n": 20
   },
   {
    "ko": "발소리·계단·문 여는 소리",
    "n": 16
   },
   {
    "ko": "외로움·관심 요구",
    "n": 15
   },
   {
    "ko": "냉장고 문 소리",
    "n": 12
   },
   {
    "ko": "펠릿 통·건초 상자",
    "n": 11
   }
  ],
  "wheek": [
   {
    "ko": "밥 시간 알람(배꼽시계)",
    "n": 21
   },
   {
    "ko": "비닐·건초봉지 바스락",
    "n": 20
   },
   {
    "ko": "발소리·계단·문 여는 소리",
    "n": 16
   },
   {
    "ko": "외로움·관심 요구",
    "n": 15
   }
  ],
  "s_tier": [
   "옥수수 껍질·수염",
   "엔다이브",
   "멜론",
   "포도",
   "파슬리",
   "키위"
  ],
  "zucchini_reject": 15,
  "word_popcorn": 228,
  "word_wheek": 157,
  "negative_popcorn": 12,
  "words": [
   {
    "word": "popcorn",
    "ko": "팝코닝(제자리 점프)",
    "group": "몸짓",
    "count": 228
   },
   {
    "word": "wheek",
    "ko": "윅윅(밥 달라는 울음)",
    "group": "소리",
    "count": 157
   },
   {
    "word": "rumble / brrr",
    "ko": "부르르(서열·경계)",
    "group": "소리",
    "count": 36
   },
   {
    "word": "go crazy / nuts",
    "ko": "환장함",
    "group": "감정",
    "count": 22
   },
   {
    "word": "LOOOVE",
    "ko": "격하게 사랑함",
    "group": "감정",
    "count": 22
   },
   {
    "word": "beg",
    "ko": "조르기",
    "group": "몸짓",
    "count": 20
   },
   {
    "word": "zoomies",
    "ko": "우다다 질주",
    "group": "몸짓",
    "count": 18
   }
  ],
  "tiers": {
   "S": [
    {
     "ko": "옥수수 껍질·수염",
     "n": 8,
     "score": 1.2
    },
    {
     "ko": "엔다이브",
     "n": 7,
     "score": 1.111
    },
    {
     "ko": "멜론",
     "n": 9,
     "score": 1.091
    },
    {
     "ko": "포도",
     "n": 15,
     "score": 1.059
    },
    {
     "ko": "파슬리",
     "n": 42,
     "score": 0.955
    },
    {
     "ko": "키위",
     "n": 8,
     "score": 0.9
    }
   ],
   "A": [
    {
     "ko": "민들레잎",
     "n": 15,
     "score": 0.882
    },
    {
     "ko": "당근",
     "n": 117,
     "score": 0.824
    },
    {
     "ko": "라디키오",
     "n": 7,
     "score": 0.778
    },
    {
     "ko": "수박",
     "n": 21,
     "score": 0.696
    },
    {
     "ko": "고수",
     "n": 57,
     "score": 0.678
    },
    {
     "ko": "바질",
     "n": 9,
     "score": 0.636
    },
    {
     "ko": "민트",
     "n": 6,
     "score": 0.625
    },
    {
     "ko": "로메인",
     "n": 19,
     "score": 0.619
    },
    {
     "ko": "상추·잎상추",
     "n": 84,
     "score": 0.616
    },
    {
     "ko": "딸기",
     "n": 18,
     "score": 0.6
    }
   ],
   "B": [
    {
     "ko": "브로콜리",
     "n": 12,
     "score": 0.5
    },
    {
     "ko": "바나나",
     "n": 8,
     "score": 0.5
    },
    {
     "ko": "시금치",
     "n": 9,
     "score": 0.455
    },
    {
     "ko": "깍지콩",
     "n": 23,
     "score": 0.44
    },
    {
     "ko": "파프리카·피망",
     "n": 105,
     "score": 0.421
    },
    {
     "ko": "토마토",
     "n": 68,
     "score": 0.371
    },
    {
     "ko": "케일",
     "n": 15,
     "score": 0.353
    },
    {
     "ko": "사과",
     "n": 38,
     "score": 0.35
    },
    {
     "ko": "생풀",
     "n": 13,
     "score": 0.333
    },
    {
     "ko": "블루베리",
     "n": 7,
     "score": 0.333
    },
    {
     "ko": "오이",
     "n": 50,
     "score": 0.25
    }
   ],
   "C": [
    {
     "ko": "옥수수 알",
     "n": 10,
     "score": 0.167
    },
    {
     "ko": "셀러리",
     "n": 21,
     "score": 0.13
    },
    {
     "ko": "완두콩",
     "n": 6,
     "score": 0.125
    },
    {
     "ko": "오렌지",
     "n": 17,
     "score": 0.053
    },
    {
     "ko": "펌킨 호박",
     "n": 4,
     "score": -0.167
    },
    {
     "ko": "스쿼시 호박",
     "n": 18,
     "score": -0.4
    },
    {
     "ko": "딜",
     "n": 5,
     "score": -0.429
    },
    {
     "ko": "아스파라거스",
     "n": 7,
     "score": -0.444
    },
    {
     "ko": "주키니",
     "n": 32,
     "score": -0.588
    },
    {
     "ko": "겨자잎",
     "n": 4,
     "score": -0.667
    },
    {
     "ko": "래디시",
     "n": 5,
     "score": -1.0
    }
   ]
  },
  "popular": [
   {
    "ko": "당근",
    "n": 117,
    "score": 0.824,
    "love": 47,
    "reject": 4
   },
   {
    "ko": "파프리카·피망",
    "n": 105,
    "score": 0.421,
    "love": 30,
    "reject": 13
   },
   {
    "ko": "상추·잎상추",
    "n": 84,
    "score": 0.616,
    "love": 24,
    "reject": 2
   },
   {
    "ko": "토마토",
    "n": 68,
    "score": 0.371,
    "love": 17,
    "reject": 9
   },
   {
    "ko": "고수",
    "n": 57,
    "score": 0.678,
    "love": 25,
    "reject": 7
   },
   {
    "ko": "오이",
    "n": 50,
    "score": 0.25,
    "love": 11,
    "reject": 6
   },
   {
    "ko": "파슬리",
    "n": 42,
    "score": 0.955,
    "love": 18,
    "reject": 0
   },
   {
    "ko": "사과",
    "n": 38,
    "score": 0.35,
    "love": 10,
    "reject": 3
   },
   {
    "ko": "주키니",
    "n": 32,
    "score": -0.588,
    "love": 4,
    "reject": 15
   }
  ]
 },
 "sources": {
  "ai": "data/classification_results.csv (Kaggle · ResNet18 전이학습, 검증 20장)",
  "care": "analysis/findings.md F1–F3 · GuineaPigCages.com 질문 47건",
  "joy": "analysis/findings.md J1–J4 · GuineaPigCages.com 스레드 44개 · 931문단"
 }
};
