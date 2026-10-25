// 자동 생성: scripts/analysis/2026-10-25_f1-build-deck-data.py — 직접 고치지 말고 스크립트를 다시 실행하세요.
window.F1 = {
 "meta": {
  "seasons": "2022–2024",
  "races": 68,
  "stops": 2330,
  "stops_raw": 2542,
  "undercuts": 195,
  "laps": 74489,
  "docs": 45,
  "chars": 518695,
  "fan_docs": 31,
  "sentences": 3372,
  "strategy_sentences": 711,
  "pit_lane_median": 23.58,
  "err_all": 10.6,
  "slow_all": 29.2,
  "err_by_year": {
   "2022": 9.2,
   "2023": 12.9,
   "2024": 9.5
  }
 },
 "compounds": {
  "SOFT": 641,
  "MEDIUM": 1411,
  "HARD": 1336,
  "INTERMEDIATE": 241,
  "WET": 28
 },
 "h1a": {
  "buckets": [
   {
    "label": "< +0.5s",
    "n": 1601,
    "mean": -2.54,
    "median": -2.0
   },
   {
    "label": "+0.5 ~ +3s",
    "n": 419,
    "mean": -2.96,
    "median": -3.0
   },
   {
    "label": "≥ +3s",
    "n": 207,
    "mean": -3.63,
    "median": -3.0
   }
  ],
  "effect05": -0.65,
  "ci05": [
   -0.93,
   -0.37
  ],
  "p05": 5.06e-05,
  "n05": 626,
  "nref05": 1601,
  "mean05": -3.18,
  "meanref05": -2.54,
  "effect3": -1.0,
  "ci3": [
   -1.51,
   -0.49
  ],
  "p3": 0.000547,
  "rho": -0.163,
  "rho_p": 1.17e-14
 },
 "h1b": {
  "slow": 21.7,
  "ok": 53.3,
  "n_slow": 60,
  "n_ok": 135,
  "diff": -31.7,
  "p": 2.55e-05,
  "r": -0.282,
  "r_p": 6.57e-05,
  "overall": 43.6,
  "by_year": {
   "2022": 41.0,
   "2023": 46.4,
   "2024": 43.1
  }
 },
 "sent": {
  "dist": {
   "중립": 493,
   "긍정": 116,
   "비판": 75,
   "불안": 27
  },
  "fan": {
   "중립": 67.9,
   "긍정": 15.5,
   "비판": 11.4,
   "불안": 5.3
  },
  "media": {
   "중립": 70.9,
   "긍정": 17.1,
   "비판": 9.7,
   "불안": 2.3
  },
  "pit_err": {
   "n": 21,
   "crit": 71.4,
   "ref": 8.7,
   "n_ref": 690,
   "p": 1.89e-11
  },
  "undercut": {
   "n": 38,
   "crit": 7.9,
   "ref": 10.7,
   "p": 0.788
  },
  "bigrams": [
   [
    "pit stop",
    40
   ],
   [
    "first stint",
    19
   ],
   [
    "hard tyres",
    16
   ],
   [
    "second stint",
    13
   ],
   [
    "red bull",
    13
   ],
   [
    "grand prix",
    13
   ],
   [
    "final stint",
    11
   ],
   [
    "pit lane",
    11
   ]
  ],
  "trigrams": [
   [
    "pitted hard tyres",
    6
   ],
   [
    "slow pit stop",
    4
   ],
   [
    "second pit stop",
    4
   ],
   [
    "austrian grand prix",
    4
   ]
  ]
 },
 "corr": {
  "err_trust": {
   "rho": 0.127,
   "p": 0.726,
   "lo": -0.65,
   "hi": 0.87,
   "partial": 0.127,
   "partial_p": 0.726
  },
  "err_trust_doc": {
   "rho": 0.552,
   "p": 0.098,
   "lo": -0.13,
   "hi": 0.96,
   "partial": 0.386,
   "partial_p": 0.271
  },
  "delay_trust": {
   "rho": 0.018,
   "p": 0.96,
   "lo": -0.85,
   "hi": 0.69,
   "partial": -0.097,
   "partial_p": 0.791
  },
  "uc_crit": {
   "rho": -0.385,
   "p": 0.272,
   "lo": -0.85,
   "hi": 0.3,
   "partial": -0.485,
   "partial_p": 0.156
  },
  "delay_trust_8": {
   "rho": -0.286,
   "p": 0.493,
   "lo": -1.0,
   "hi": 0.59,
   "partial": 0.626,
   "partial_p": 0.097
  }
 },
 "teams": [
  {
   "team": "Red Bull",
   "stops": 251,
   "lane": 24.07,
   "delay": 0.2,
   "slow": 15.9,
   "err": 8.8,
   "posl3": -1.73,
   "uc_att": 8,
   "uc_rate": 25.0,
   "uc_def": 14,
   "uc_def_rate": 78.6,
   "finish": 3.83,
   "points": 2051,
   "stops_race": 1.98,
   "soft": 17.9,
   "medium": 42.0,
   "hard": 32.1,
   "sent_n": 65,
   "docs": 20,
   "pos": 18.5,
   "anx": 7.7,
   "crit": 6.2,
   "vader": -0.033,
   "trust": 12.3,
   "trust_doc": 7.9,
   "keywords": "stop:16 red:13 max:12 tyres:12 bull:12 pit:11 strategy:9 second:8",
   "err_by_year": {
    "2022": 4.8,
    "2023": 12.5,
    "2024": 8.8
   },
   "delay_by_year": {
    "2022": -0.16,
    "2023": 0.4,
    "2024": 0.34
   },
   "slow_by_year": {
    "2022": 14.5,
    "2023": 15.9,
    "2024": 17.5
   }
  },
  {
   "team": "Ferrari",
   "stops": 217,
   "lane": 24.11,
   "delay": 0.25,
   "slow": 17.1,
   "err": 6.9,
   "posl3": -2.2,
   "uc_att": 8,
   "uc_rate": 25.0,
   "uc_def": 14,
   "uc_def_rate": 85.7,
   "finish": 4.48,
   "points": 1477,
   "stops_race": 1.7,
   "soft": 16.2,
   "medium": 39.9,
   "hard": 37.3,
   "sent_n": 120,
   "docs": 25,
   "pos": 20.0,
   "anx": 8.3,
   "crit": 14.2,
   "vader": 0.072,
   "trust": 5.8,
   "trust_doc": 1.1,
   "keywords": "stint:25 strategy:24 stop:22 tyres:21 pit:21 norris:18 lando:16 tyre:13",
   "err_by_year": {
    "2022": 6.8,
    "2023": 8.7,
    "2024": 5.3
   },
   "delay_by_year": {
    "2022": 0.32,
    "2023": 0.11,
    "2024": 0.33
   },
   "slow_by_year": {
    "2022": 24.7,
    "2023": 15.9,
    "2024": 10.7
   }
  },
  {
   "team": "Mercedes",
   "stops": 234,
   "lane": 24.26,
   "delay": 0.39,
   "slow": 21.8,
   "err": 8.5,
   "posl3": -2.16,
   "uc_att": 27,
   "uc_rate": 40.7,
   "uc_def": 13,
   "uc_def_rate": 53.8,
   "finish": 5.45,
   "points": 1302,
   "stops_race": 1.84,
   "soft": 14.2,
   "medium": 40.7,
   "hard": 37.7,
   "sent_n": 76,
   "docs": 23,
   "pos": 14.5,
   "anx": 3.9,
   "crit": 7.9,
   "vader": 0.044,
   "trust": 6.6,
   "trust_doc": 2.6,
   "keywords": "tyre:22 stop:12 strategy:12 first:8 lando:8 tyres:8 softs:8 pit:7",
   "err_by_year": {
    "2022": 7.9,
    "2023": 7.5,
    "2024": 10.3
   },
   "delay_by_year": {
    "2022": 0.59,
    "2023": 0.38,
    "2024": 0.2
   },
   "slow_by_year": {
    "2022": 25.0,
    "2023": 20.0,
    "2024": 20.5
   }
  },
  {
   "team": "McLaren",
   "stops": 237,
   "lane": 24.54,
   "delay": 0.71,
   "slow": 23.6,
   "err": 9.7,
   "posl3": -2.62,
   "uc_att": 13,
   "uc_rate": 38.5,
   "uc_def": 27,
   "uc_def_rate": 63.0,
   "finish": 7.42,
   "points": 1025,
   "stops_race": 1.9,
   "soft": 15.5,
   "medium": 38.8,
   "hard": 38.5,
   "sent_n": 156,
   "docs": 24,
   "pos": 16.0,
   "anx": 9.0,
   "crit": 11.5,
   "vader": 0.02,
   "trust": 4.5,
   "trust_doc": 10.1,
   "keywords": "stop:32 pit:29 strategy:23 tyre:19 stint:19 undercut:18 first:17 driver:17",
   "err_by_year": {
    "2022": 5.1,
    "2023": 18.3,
    "2024": 5.2
   },
   "delay_by_year": {
    "2022": 0.41,
    "2023": 1.63,
    "2024": 0.03
   },
   "slow_by_year": {
    "2022": 25.6,
    "2023": 31.7,
    "2024": 13.0
   }
  },
  {
   "team": "Aston Martin",
   "stops": 236,
   "lane": 24.34,
   "delay": 0.59,
   "slow": 26.7,
   "err": 5.5,
   "posl3": -3.07,
   "uc_att": 19,
   "uc_rate": 57.9,
   "uc_def": 24,
   "uc_def_rate": 70.8,
   "finish": 9.99,
   "points": 415,
   "stops_race": 1.89,
   "soft": 18.6,
   "medium": 37.5,
   "hard": 36.1,
   "sent_n": 86,
   "docs": 18,
   "pos": 10.5,
   "anx": 2.3,
   "crit": 10.5,
   "vader": 0.005,
   "trust": 0.0,
   "trust_doc": 6.7,
   "keywords": "pit:21 inters:11 vsc:9 first:9 pace:9 stop:8 behind:8 stint:8",
   "err_by_year": {
    "2022": 2.7,
    "2023": 6.2,
    "2024": 7.4
   },
   "delay_by_year": {
    "2022": 0.32,
    "2023": 0.59,
    "2024": 0.83
   },
   "slow_by_year": {
    "2022": 30.7,
    "2023": 27.5,
    "2024": 22.2
   }
  },
  {
   "team": "Alpine",
   "stops": 214,
   "lane": 24.39,
   "delay": 0.77,
   "slow": 30.4,
   "err": 9.3,
   "posl3": -3.3,
   "uc_att": 24,
   "uc_rate": 41.7,
   "uc_def": 23,
   "uc_def_rate": 43.5,
   "finish": 10.32,
   "points": 343,
   "stops_race": 1.68,
   "soft": 16.8,
   "medium": 36.2,
   "hard": 39.4,
   "sent_n": 11,
   "docs": 7,
   "pos": 27.3,
   "anx": 0.0,
   "crit": 0.0,
   "vader": 0.018,
   "trust": 27.3,
   "trust_doc": 33.3,
   "keywords": "tyre:3 stop:3 pitted:3 sainz:2 second:2 behind:2 late:2 racing:1",
   "err_by_year": {
    "2022": 7.4,
    "2023": 13.3,
    "2024": 7.0
   },
   "delay_by_year": {
    "2022": 0.47,
    "2023": 1.23,
    "2024": 0.58
   },
   "slow_by_year": {
    "2022": 27.9,
    "2023": 34.7,
    "2024": 28.2
   }
  },
  {
   "team": "RB",
   "stops": 237,
   "lane": 24.74,
   "delay": 0.93,
   "slow": 24.1,
   "err": 13.1,
   "posl3": -3.11,
   "uc_att": 26,
   "uc_rate": 38.5,
   "uc_def": 27,
   "uc_def_rate": 44.4,
   "finish": 12.64,
   "points": 97,
   "stops_race": 1.87,
   "soft": 22.3,
   "medium": 34.3,
   "hard": 35.1,
   "sent_n": 43,
   "docs": 10,
   "pos": 16.3,
   "anx": 0.0,
   "crit": 23.3,
   "vader": -0.029,
   "trust": -7.0,
   "trust_doc": 18.6,
   "keywords": "strategy:17 stop:10 tyres:8 behind:5 dan:5 end:5 magnussen:5 points:4",
   "err_by_year": {
    "2022": 13.4,
    "2023": 15.7,
    "2024": 9.7
   },
   "delay_by_year": {
    "2022": 1.15,
    "2023": 0.99,
    "2024": 0.61
   },
   "slow_by_year": {
    "2022": 25.6,
    "2023": 22.9,
    "2024": 23.6
   }
  },
  {
   "team": "Williams",
   "stops": 232,
   "lane": 25.21,
   "delay": 1.38,
   "slow": 36.6,
   "err": 12.5,
   "posl3": -2.62,
   "uc_att": 23,
   "uc_rate": 56.5,
   "uc_def": 16,
   "uc_def_rate": 62.5,
   "finish": 13.66,
   "points": 51,
   "stops_race": 1.82,
   "soft": 18.8,
   "medium": 42.7,
   "hard": 33.0,
   "sent_n": 13,
   "docs": 7,
   "pos": 38.5,
   "anx": 7.7,
   "crit": 0.0,
   "vader": 0.177,
   "trust": 38.5,
   "trust_doc": 40.5,
   "keywords": "strategy:5 yuki:5 drivers:4 penalty:3 stint:3 stroll:3 three:3 hard:3",
   "err_by_year": {
    "2022": 13.3,
    "2023": 11.8,
    "2024": 12.3
   },
   "delay_by_year": {
    "2022": 1.03,
    "2023": 2.02,
    "2024": 1.11
   },
   "slow_by_year": {
    "2022": 37.3,
    "2023": 38.2,
    "2024": 34.2
   }
  },
  {
   "team": "Sauber",
   "stops": 229,
   "lane": 25.5,
   "delay": 1.7,
   "slow": 44.5,
   "err": 11.8,
   "posl3": -2.94,
   "uc_att": 22,
   "uc_rate": 40.9,
   "uc_def": 15,
   "uc_def_rate": 20.0,
   "finish": 13.64,
   "points": 73,
   "stops_race": 1.85,
   "soft": 20.4,
   "medium": 34.1,
   "hard": 39.0,
   "sent_n": 23,
   "docs": 6,
   "pos": 4.3,
   "anx": 4.3,
   "crit": 17.4,
   "vader": -0.257,
   "trust": -13.0,
   "trust_doc": -4.6,
   "keywords": "problems:6 first:6 pit:6 season:3 pitstops:3 stops:3 wheel:3 stop:3",
   "err_by_year": {
    "2022": 11.3,
    "2023": 12.4,
    "2024": 11.5
   },
   "delay_by_year": {
    "2022": 1.2,
    "2023": 1.91,
    "2024": 1.86
   },
   "slow_by_year": {
    "2022": 48.4,
    "2023": 43.8,
    "2024": 42.3
   }
  },
  {
   "team": "Haas",
   "stops": 243,
   "lane": 25.87,
   "delay": 1.87,
   "slow": 51.4,
   "err": 18.9,
   "posl3": -3.49,
   "uc_att": 25,
   "uc_rate": 48.0,
   "uc_def": 22,
   "uc_def_rate": 50.0,
   "finish": 13.2,
   "points": 93,
   "stops_race": 1.9,
   "soft": 14.4,
   "medium": 39.4,
   "hard": 37.2,
   "sent_n": 43,
   "docs": 8,
   "pos": 27.9,
   "anx": 11.6,
   "crit": 7.0,
   "vader": 0.08,
   "trust": 20.9,
   "trust_doc": 29.8,
   "keywords": "behind:10 pit:9 track:8 tyres:8 stop:8 alonso:6 drivers:5 strategy:5",
   "err_by_year": {
    "2022": 19.4,
    "2023": 20.9,
    "2024": 16.5
   },
   "delay_by_year": {
    "2022": 1.76,
    "2023": 2.1,
    "2024": 1.74
   },
   "slow_by_year": {
    "2022": 65.3,
    "2023": 48.8,
    "2024": 42.4
   }
  }
 ],
 "sauber": {
  "early": {
   "n": 10,
   "delay": 7.8,
   "err": 30.0,
   "max": 28.97
  },
  "late": {
   "n": 68,
   "delay": 0.99,
   "err": 8.8
  },
  "stops": [
   {
    "round": 1,
    "gp": "Bahrain",
    "driver": "Zhou",
    "lap": 9,
    "delta": 0.39
   },
   {
    "round": 1,
    "gp": "Bahrain",
    "driver": "Bottas",
    "lap": 12,
    "delta": 1.6
   },
   {
    "round": 1,
    "gp": "Bahrain",
    "driver": "Zhou",
    "lap": 28,
    "delta": 0.27
   },
   {
    "round": 2,
    "gp": "Saudi Arabian",
    "driver": "Bottas",
    "lap": 7,
    "delta": 0.63
   },
   {
    "round": 2,
    "gp": "Saudi Arabian",
    "driver": "Bottas",
    "lap": 35,
    "delta": 1.12
   },
   {
    "round": 2,
    "gp": "Saudi Arabian",
    "driver": "Zhou",
    "lap": 41,
    "delta": 24.22
   },
   {
    "round": 3,
    "gp": "Australian",
    "driver": "Zhou",
    "lap": 6,
    "delta": 1.03
   },
   {
    "round": 3,
    "gp": "Australian",
    "driver": "Bottas",
    "lap": 8,
    "delta": 28.97
   },
   {
    "round": 3,
    "gp": "Australian",
    "driver": "Zhou",
    "lap": 35,
    "delta": 18.86
   },
   {
    "round": 3,
    "gp": "Australian",
    "driver": "Bottas",
    "lap": 36,
    "delta": 0.94
   }
  ]
 }
};
