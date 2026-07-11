# 资产规格与 AI 生成 Prompt · 第一批 v1

> 按 game-studio `/asset-spec` 手册产出。**先读 design/art/art-bible.md**——所有 prompt 共享同一风格锚(见下),生成后过第 9 节参考方向的"避"清单再交付。
> 交付方式:生成后把原图丢给 Claude,由 Claude 裁切/压缩/嵌入(命名规范见圣经第 8 节)。

## 通用风格锚(每条 prompt 末尾追加)

```
dark arcane arena, glowing runes, neon energy on near-black deep blue (#04060c),
cinematic rim light, painterly semi-realistic, high contrast focal glow,
70% dark negative space, game splash art style --no white background, paper texture, pixel art, photo
```
(即梦/可灵用中文时:「深色奥术竞技场,霓虹符文能量,近黑深蓝底,电影级轮廓光,半写实厚涂,画面七成留暗,游戏原画风格;禁:白底/纸质感/像素风/照片感」)

## 状态清单(entity inventory · 首批 8 件)

| # | 资产 | 文件名 | 尺寸/比例 | 状态 |
|---|---|---|---|---|
| 1 | 守门者立绘 · 磐石Σ | foe-sigma@2x.png | 1024² 透明底 | Needed |
| 2 | 守门者立绘 · 猎手Ω | foe-omega@2x.png | 1024² 透明底 | Needed |
| 3 | 守门者立绘 · 霸主Δ | foe-delta@2x.png | 1024² 透明底 | Needed |
| 4 | 战场背景 · 第一关石窟 | bg-gate1@2x.jpg | 16:9 ≥1920 | Needed |
| 5 | 战场背景 · 第二关猎林 | bg-gate2@2x.jpg | 16:9 ≥1920 | Needed |
| 6 | 战场背景 · 第三关塔顶 | bg-gate3@2x.jpg | 16:9 ≥1920 | Needed |
| 7 | 卡框三件套(银/金/彩) | frame-{silver,gold,prism}@2x.png | 3:4 透明底 | Needed |
| 8 | 标题键画 | keyart-title@2x.jpg | 16:9 | Needed |

## 逐件 Prompt

**1. 磐石Σ**(青 #3fe7ff;性格:古老、缓慢、不可撼动)
```
ancient stone golem guardian, floating cracked rock torso with glowing cyan sigma rune core,
slow heavy presence, orbiting stone fragments, cyan energy veins in cracks,
symmetrical front view, isolated character on transparent background
```
避:人形五官写实化(它是"石之意志",不是石头人)。

**2. 猎手Ω**(紫 #b561ff;性格:锐利、窥伺、快)
```
spectral hunter wraith, sleek predator silhouette formed of violet smoke and blades,
glowing purple omega rune as its eye, mid-lunge coiled posture, thin sharp shapes,
asymmetric dynamic front view, isolated character on transparent background
```
避:披风吸血鬼俗套;要"影子里的猎豹"不是"幽灵贵族"。

**3. 霸主Δ**(红 #ff5470;性格:威压、燃烧、王座)
```
tyrant overlord avatar, monolithic triangular obsidian crown-form wreathed in crimson flame,
glowing red delta rune heart, ember particles rising, oppressive scale, throne-like silhouette,
symmetrical imposing front view, isolated character on transparent background
```
避:恶魔角/骷髅脸(威压来自几何体量,不来自恐怖元素)。

**4-6. 三关背景**(同构图异色温:主体居中留空给敌人,地面有反光,暗部 ≥70%)
```
gate1: vast underground rune cavern arena, cyan glowing glyph pillars, mist floor reflection
gate2: twisted shadow forest arena at night, violet witchlights between black trees
gate3: open-air tower summit arena above clouds, crimson storm sky, burning rune ring floor
+ 通用锚 + wide empty center stage composition, no characters --ar 16:9
```

**7. 卡框三件套**(UI 资产,风格锚减半,干净优先)
```
ornate game card frame, empty center, {brushed silver / engraved gold / iridescent prismatic crystal} border,
subtle rune engraving, dark translucent inner panel, clean edges, transparent background --ar 3:4
```
避:巴洛克过度雕花(小屏上糊成一团);棱彩版要虹彩流光感不要彩虹条。

**8. 标题键画**(开始屏用;主题=一支笔即一把剑)
```
a glowing pen transforming into a sword blade, held aloft before a colossal rune tower,
three guardian sigils (cyan sigma, violet omega, red delta) orbiting the tower,
epic scale, title splash composition with dark space at top for logo --ar 16:9
```

## 验收清单(每件资产过一遍)
- [ ] 暗部占比 ≥70%,能沉进 #04060c 底色
- [ ] 主宰色相正确,没有第四个高饱和色相入侵(圣经 1.3)
- [ ] 48px 缩略下剪影仍可辨(立绘类)
- [ ] 透明底干净无白边(PNG 类)
- [ ] 过第 9 节"避"清单
