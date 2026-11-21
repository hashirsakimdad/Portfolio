"""Generate the README hero: identity on the left, a crafted neural network on the right
that turns idea + data + caffeine into a shipped product. 9 s loop = 3 inferences."""
import sys

CYCLE = 3.0          # one forward pass
N = 3                # passes per loop
T = CYCLE * N        # total loop
products = [('Bharosa', 'scam checker'), ('Sukoon AI', 'mental health AI'), ('Saath AI', 'labour marketplace')]
conf = [97, 94, 96]

layers_x = [660, 780, 900, 1010]
layers_y = [
    [150, 225, 300],
    [105, 165, 225, 285, 345],
    [105, 165, 225, 285, 345],
    [190, 260],
]
inputs = ['idea', 'data', 'caffeine']
outs = ['ship it', 'rewrite']

def pct(t):
    return f'{t / T * 100:.3f}%'

css = []
parts = []

# ---- edges: one group per layer gap, each brightens when the wave passes ----
edge_groups = []
for l in range(3):
    paths = []
    for y1 in layers_y[l]:
        for y2 in layers_y[l + 1]:
            x1, x2 = layers_x[l], layers_x[l + 1]
            mx = (x1 + x2) / 2
            paths.append(f'M{x1} {y1} C{mx} {y1} {mx} {y2} {x2} {y2}')
    edge_groups.append(paths)

for l, paths in enumerate(edge_groups):
    parts.append(f'<path class="e" d="{" ".join(paths)}"/>')
    parts.append(f'<path class="eh eh{l}" d="{" ".join(paths)}"/>')
    # bright pass of this layer's edges, once per cycle
    frames = []
    for c in range(N):
        s = c * CYCLE + 0.25 + l * 0.45
        frames += [f'{pct(s)} {{ opacity: 0; }}', f'{pct(s + 0.25)} {{ opacity: 1; }}', f'{pct(s + 0.75)} {{ opacity: 0; }}']
    css.append(f'@keyframes eh{l} {{ 0% {{ opacity: 0; }} {" ".join(frames)} 100% {{ opacity: 0; }} }}')
    css.append(f'.eh{l} {{ animation: eh{l} {T}s linear infinite; }}')

# ---- travelling sparks along a few edges each pass ----
spark = 0
for c in range(N):
    for l in range(3):
        for k in range(2):
            ya = layers_y[l][(c + k * 2 + l) % len(layers_y[l])]
            yb = layers_y[l + 1][(c * 2 + k + l) % len(layers_y[l + 1])]
            x1, x2 = layers_x[l], layers_x[l + 1]
            mx = (x1 + x2) / 2
            path = f'M{x1} {ya} C{mx} {ya} {mx} {yb} {x2} {yb}'
            s = c * CYCLE + 0.25 + l * 0.45
            name = f'sp{spark}'
            css.append(f'@keyframes {name} {{ 0%, {pct(s)} {{ offset-distance: 0%; opacity: 0; }} {pct(s + 0.05)} {{ opacity: 1; }} {pct(s + 0.5)} {{ offset-distance: 100%; opacity: 1; }} {pct(s + 0.55)}, 100% {{ offset-distance: 100%; opacity: 0; }} }}')
            parts.append(f'<circle class="spark" r="4" style="offset-path: path(\'{path}\'); animation: {name} {T}s linear infinite;"/>')
            spark += 1

# ---- nodes: ring + core that lights up as the wave reaches its layer ----
for l, ys in enumerate(layers_y):
    frames = []
    for c in range(N):
        s = c * CYCLE + 0.2 + l * 0.45
        frames += [f'{pct(s)} {{ fill: #1b1b24; r: 9px; }}', f'{pct(s + 0.2)} {{ fill: {"#22d3ee" if l == 3 else "#c4b5fd"}; r: 11px; }}', f'{pct(s + 0.9)} {{ fill: #1b1b24; r: 9px; }}']
    css.append(f'@keyframes n{l} {{ 0% {{ fill: #1b1b24; r: 9px; }} {" ".join(frames)} 100% {{ fill: #1b1b24; r: 9px; }} }}')
    for i, y in enumerate(ys):
        x = layers_x[l]
        hot = l == 3 and i == 0
        parts.append(f'<circle cx="{x}" cy="{y}" r="16" fill="none" stroke="{"#22d3ee" if l == 3 else "#a78bfa"}" stroke-opacity="0.22"/>')
        parts.append(f'<circle class="nd" cx="{x}" cy="{y}" r="9" style="animation: n{l} {T}s linear infinite; animation-delay: {i * 0.04:.2f}s"/>')

# ---- input labels ----
for name, y in zip(inputs, layers_y[0]):
    parts.append(f'<text class="mono lab" x="{layers_x[0] - 26}" y="{y + 6}" text-anchor="end">{name}</text>')

# ---- output probability bars ----
bx = layers_x[3] + 26
for j, (name, y) in enumerate(zip(outs, layers_y[3])):
    parts.append(f'<text class="mono lab" x="{bx}" y="{y - 12}">{name}</text>')
    parts.append(f'<rect x="{bx}" y="{y - 4}" width="120" height="8" rx="4" fill="#ffffff" fill-opacity="0.08"/>')
    frames = []
    for c in range(N):
        p = conf[c] if j == 0 else 100 - conf[c]
        w = 120 * p / 100
        s = c * CYCLE + 1.55
        frames += [f'{pct(c * CYCLE + 0.01)} {{ width: 0px; }}', f'{pct(s)} {{ width: 0px; }}', f'{pct(s + 0.5)} {{ width: {w:.1f}px; }}', f'{pct((c + 1) * CYCLE - 0.15)} {{ width: {w:.1f}px; }}']
    css.append(f'@keyframes bar{j} {{ 0% {{ width: 0px; }} {" ".join(frames)} 100% {{ width: 0px; }} }}')
    parts.append(f'<rect class="bar{j}" x="{bx}" y="{y - 4}" width="0" height="8" rx="4" fill="url(#{"grad" if j == 0 else "dim"})" style="animation: bar{j} {T}s linear infinite;"/>')
    for c in range(N):
        p = conf[c] if j == 0 else 100 - conf[c]
        name = f'pv{j}{c}'
        s = c * CYCLE + 1.7
        css.append(f'@keyframes {name} {{ 0%, {pct(s)} {{ opacity: 0; }} {pct(s + 0.2)}, {pct((c + 1) * CYCLE - 0.15)} {{ opacity: 1; }} {pct((c + 1) * CYCLE - 0.05)}, 100% {{ opacity: 0; }} }}')
        parts.append(f'<text class="mono pv" x="{bx + 120}" y="{y - 12}" text-anchor="end" style="opacity: 0; animation: {name} {T}s linear infinite;">{p}%</text>')

# ---- output card: the product that came out ----
cx, cy, cw, ch = 690, 370, 460, 36
parts.append(f'<rect x="{cx}" y="{cy}" width="{cw}" height="{ch}" rx="17" fill="#0f2a30" stroke="#22d3ee" stroke-opacity="0.6"/>')
parts.append(f'<text class="mono outk" x="{cx + 18}" y="{cy + 23}">output →</text>')
for c, (pname, tag) in enumerate(products):
    name = f'op{c}'
    s = c * CYCLE + 1.9
    css.append(f'@keyframes {name} {{ 0%, {pct(s)} {{ opacity: 0; transform: translateY(6px); }} {pct(s + 0.25)}, {pct((c + 1) * CYCLE - 0.15)} {{ opacity: 1; transform: none; }} {pct((c + 1) * CYCLE - 0.02)}, 100% {{ opacity: 0; transform: translateY(-6px); }} }}')
    parts.append(f'<text class="sans outv" x="{cx + 118}" y="{cy + 23}" style="opacity: 0; animation: {name} {T}s linear infinite;"><tspan font-weight="700" fill="#f4f4f5">{pname}</tspan><tspan fill="#a1a1aa"> · {tag}</tspan></text>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" width="1200" height="420" role="img" aria-labelledby="t d">
  <title id="t">Hashir Sakimdad, AI engineer. Portfolio source code.</title>
  <desc id="d">Banner with the name Hashir Sakimdad and the role AI engineer. On the right, a neural network takes idea, data and caffeine as inputs; an activation wave flows through its layers, the output bars show ship it at about 95 percent, and the output card names a shipped product: Bharosa, Sukoon AI, then Saath AI.</desc>
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>
    <linearGradient id="dim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#52525b"/><stop offset="1" stop-color="#71717a"/></linearGradient>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>
    <radialGradient id="glowV" cx="0.15" cy="0" r="0.8"><stop offset="0" stop-color="#a78bfa" stop-opacity="0.35"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowC" cx="0.85" cy="0.6" r="0.55"><stop offset="0" stop-color="#22d3ee" stop-opacity="0.16"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/></radialGradient>
    <clipPath id="frame"><rect width="1200" height="420" rx="28"/></clipPath>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity="0.035"/></pattern>
    <style>
      .sans {{ font-family: 'Space Grotesk', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }}
      .mono {{ font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }}
      .e {{ fill: none; stroke: #a78bfa; stroke-opacity: 0.13; stroke-width: 1.2; }}
      .eh {{ fill: none; stroke: url(#edge); stroke-opacity: 0.75; stroke-width: 1.6; opacity: 0; }}
      .nd {{ fill: #1b1b24; stroke: #e4e4e7; stroke-opacity: 0.55; stroke-width: 1.5; }}
      .spark {{ fill: #ffffff; }}
      .lab {{ font-size: 18px; fill: #a1a1aa; }}
      .pv {{ font-size: 18px; fill: #f4f4f5; }}
      .outk {{ font-size: 17px; fill: #22d3ee; }}
      .outv {{ font-size: 19px; }}
      @keyframes caret {{ 0%, 49% {{ opacity: 1; }} 50%, 100% {{ opacity: 0; }} }}
      #caret {{ animation: caret 1.5s steps(1) infinite; }}
      {chr(10).join('      ' + c for c in css)}
    </style>
  </defs>

  <g clip-path="url(#frame)">
    <rect width="1200" height="420" fill="#0b0b0e"/>
    <rect width="1200" height="420" fill="url(#grid)"/>
    <rect width="1200" height="420" fill="url(#glowV)"/>
    <rect width="1200" height="420" fill="url(#glowC)"/>

    <!-- identity -->
    <text class="mono" x="72" y="106" font-size="20" fill="#a78bfa" letter-spacing="3">PORTFOLIO · SOURCE</text>
    <g class="sans" font-weight="700" fill="#f4f4f5" letter-spacing="-2">
      <text x="68" y="190" font-size="84">Hashir</text>
      <text x="68" y="274" font-size="84" fill="none" stroke="#f4f4f5" stroke-opacity="0.7" stroke-width="1.6">Sakimdad</text>
    </g>
    <text class="sans" x="72" y="336" font-size="34" font-weight="600" fill="url(#grad)">AI engineer</text>
    <rect id="caret" x="262" y="310" width="3" height="32" fill="#22d3ee"/>
    <text class="mono" x="72" y="378" font-size="18" fill="#71717a">hashirsakimdad.vercel.app</text>

    <!-- network: idea + data + caffeine in, a shipped product out -->
    <text class="mono" x="612" y="58" font-size="17" fill="#71717a">forward pass · P = ∫ (M·F)ᴱ dt</text>
    {chr(10).join('    ' + p for p in parts)}

    <!-- crafted signature -->
    <g transform="translate(972 40)">
      <rect width="186" height="30" rx="15" fill="none" stroke="#a78bfa" stroke-opacity="0.45" stroke-dasharray="4 4"/>
      <text class="mono" x="93" y="20" font-size="15" fill="#c4b5fd" text-anchor="middle">crafted by Hashir</text>
    </g>
  </g>
  <rect width="1199" height="419" x="0.5" y="0.5" rx="28" fill="none" stroke="#ffffff" stroke-opacity="0.1"/>
</svg>
'''
open(sys.argv[1], 'w').write(svg)
print('ok', spark, 'sparks')
