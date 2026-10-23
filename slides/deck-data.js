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
  ]
 },
 "care": {
  "posts": 47,
  "neg": 27,
  "neg_pct": 57.4,
  "top_cat": "질병/동물병원",
  "top_cat_pct": 34.0,
  "bond_neg_pct": 77.8,
  "top_kw": "vet",
  "top_kw_n": 51
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
  "word_wheek": 157
 },
 "sources": {
  "ai": "data/classification_results.csv (Kaggle · ResNet18 전이학습, 검증 20장)",
  "care": "analysis/findings.md F1–F3 · GuineaPigCages.com 질문 47건",
  "joy": "analysis/findings.md J1–J4 · GuineaPigCages.com 스레드 44개 · 931문단"
 }
};
