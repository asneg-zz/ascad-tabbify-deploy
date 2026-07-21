import{r as i,j as s}from"./r3f-6m1Q0irS.js";import{c as Y,A as C,t as x,u as X,a as R,b as T,d as D,g as B,e as F,f as I,C as M,L as E,S as j}from"./index-BZOtDqpc.js";import{r as O}from"./pyodideClient-bK4gKjK_.js";import"./three-w7Pko7sm.js";const Z=Y("FilePlus2",[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4",key:"702lig"}],["polyline",{points:"14 2 14 8 20 8",key:"1ew0cm"}],["path",{d:"M3 15h6",key:"4e2qda"}],["path",{d:"M6 12v6",key:"1u72j0"}]]);function $(e){const n=e.match(/```(?:python|py)?[ \t]*\r?\n([\s\S]*?)```/i);return n&&n[1].trim()?n[1].trim():/\bScene\s*\(/.test(e)&&/\bscene\b/.test(e)?e.trim():null}async function L(e,n={}){let r;try{r=await fetch(`${C}/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:e,model:n.model,temperature:n.temperature}),signal:n.signal})}catch(a){throw new Error(x("pyed.ai.proxyUnavailable",{url:C,msg:a instanceof Error?a.message:String(a)}))}const h=await r.json().catch(()=>({}));if(!r.ok||h.error)throw new Error(h.error||x("pyed.ai.proxyStatus",{status:r.status}));if(typeof h.content!="string")throw new Error(x("pyed.ai.proxyEmpty"));return h.content}const G=`vcad-py API — единицы миллиметры; импортируй только из \`vcad\` и стандартного \`math\`.

Scene / Body:
  scene = Scene()
  body  = scene.add_body(name="Part")
  # Примитивы (быстрые тела). ВАЖНО: отцентрованы по началу координат —
  # тело высотой H занимает z ∈ [−H/2, +H/2], верхняя грань на z=+H/2 (НЕ z=H), низ на z=−H/2.
  body.cube(width, height, depth, position=(x,y,z))
  body.cylinder(radius, height, position=(x,y,z))
  body.sphere(radius); body.cone(...)
  # Эскиз -> объём:
  sk = body.start_sketch(plane=Plane.XY, offset=0.0)   # plane: Plane.XY / Plane.XZ / Plane.YZ; offset сдвигает плоскость по нормали
  body.extrude(sketch, height, height_backward=0.0, draft_angle=0.0, is_cut=False)
  body.cut(sketch, height, height_backward=0.0)        # = extrude(is_cut=True); сквозное отверстие: эскиз на offset=толщина + большой height_backward
  body.revolve(sketch, axis_start=(x,y), axis_end=(x,y), angle=360.0, segments=64, cut=False)  # ось — 2D в плоскости эскиза; профиль не должен пересекать ось
  body.loft([sk_low, sk_high], ruled=False)            # >=2 эскиза на разных offset, снизу вверх
  body.sweep(profile, path, twist_angle=0.0, frenet=False, is_cut=False)  # profile/path — эскизы (Sketch), позиционно; протянуть профиль вдоль пути
  body.sweep_helix(profile, pitch=.., height=.., radius=.., center=(x,y,z), lefthand=False)  # profile — эскиз (1-й позиционный); остальное по имени; винт/пружина/резьба
  # Модификаторы текущего тела:
  body.shell(thickness, faces_to_remove=[((px,py,pz),(nx,ny,nz))])   # выдалбливание; грань задаётся точкой на ней + внешней нормалью
  body.mirror(plane="XZ", merge=True)                  # plane "XY"|"XZ"|"YZ" через начало координат
  body.linear_pattern(direction=(x,y,z), count, spacing, merge=True)        # count включает оригинал
  body.circular_pattern(axis_point=(x,y,z), axis_direction=(x,y,z), count, step_angle_deg, merge=True)
  body.fillet_3d(edges=[((sx,sy,sz),(ex,ey,ez))], radius)              # ребро = две 3D-точки его концов
  body.chamfer_3d(edges=[((sx,sy,sz),(ex,ey,ez))], distance1, distance2=None)
  body.set_color("#ff8800")                            # цвет тела (hex), для наглядных моделей
  scene.boolean("union"|"difference"|"intersection", a, b, name="Result")  # CSG двух тел (a, b — Body)

Sketch (2D, координаты в плоскости эскиза):
  sk.circle(center=(x,y), radius=r)
  sk.rectangle_centered(center=(x,y), width=w, height=h)
  sk.rectangle(corner=(x,y), width=w, height=h)
  sk.polygon(center=(x,y), radius=r, sides=n)
  sk.line(start=(x,y), end=(x,y)); sk.arc(...); sk.polyline([(x,y), ...]); sk.spline([(x,y), ...])
  sk.ellipse(center=(x,y), rx=.., ry=..); sk.slot(start=(x,y), end=(x,y), radius=r)
  sk.text(position=(x,y), text="ASCAD", height=10)      # контуры букв — extrude для выпуклых, cut для гравировки`,K=[`# Пластина-звезда 5 мм с центральным сквозным отверстием Ø6
from vcad import Scene, Plane

thickness = 5.0
scene = Scene()
body = scene.add_body(name="StarPlate")

sk_star = body.start_sketch(plane=Plane.XY)
sk_star.polygon(center=(0, 0), radius=20, sides=5)
body.extrude(sk_star, height=thickness)

sk_hole = body.start_sketch(plane=Plane.XY, offset=thickness)
sk_hole.circle(center=(0, 0), radius=3)
body.cut(sk_hole, height=0, height_backward=thickness + 1)`,`# Стакан: цилиндр, выдолбленный оболочкой 2 мм с открытым верхом
from vcad import Scene, Plane

radius, height, wall = 30.0, 60.0, 2.0
scene = Scene()
body = scene.add_body(name="Cup")

sk = body.start_sketch(plane=Plane.XY)
sk.circle(center=(0, 0), radius=radius)
body.extrude(sk, height=height)
# убрать верхнюю грань: точка на ней + нормаль +Z
body.shell(thickness=wall, faces_to_remove=[((0.0, 0.0, height), (0.0, 0.0, 1.0))])`,`# Бутылка лофтом: круглое дно -> квадратный верх
from vcad import Scene, Plane

scene = Scene()
body = scene.add_body(name="Bottle")

bottom = body.start_sketch(plane=Plane.XY)
bottom.circle(center=(0, 0), radius=25)
top = body.start_sketch(plane=Plane.XY, offset=80)
top.rectangle_centered(center=(0, 0), width=30, height=30)
body.loft([bottom, top])`,`# Забор: один столбик, размноженный линейным массивом
from vcad import Scene, Plane

count, spacing = 6, 20.0
scene = Scene()
body = scene.add_body(name="Fence")

sk = body.start_sketch(plane=Plane.XY)
sk.circle(center=(0, 0), radius=3)
body.extrude(sk, height=40)
body.linear_pattern(direction=(1.0, 0.0, 0.0), count=count, spacing=spacing)`,`# Ступица: спица, размноженная круговым массивом вокруг оси Z
from vcad import Scene, Plane

spokes = 8
scene = Scene()
body = scene.add_body(name="Hub")

sk = body.start_sketch(plane=Plane.XY)
sk.circle(center=(20, 0), radius=4)
body.extrude(sk, height=10)
body.circular_pattern(axis_point=(0.0, 0.0, 0.0), axis_direction=(0.0, 0.0, 1.0),
                      count=spokes, step_angle_deg=360.0 / spokes)`,`# Тело вращения: профиль вокруг оси Y даёт усечённый конус
from vcad import Scene, Plane

scene = Scene()
body = scene.add_body(name="Revolved")

sk = body.start_sketch(plane=Plane.XY)
sk.polyline([(0, 0), (20, 0), (12, 40), (0, 40), (0, 0)])  # профиль справа от оси Y
body.revolve(sk, axis_start=(0, 0), axis_end=(0, 40), angle=360)`,`# Пружина: круглый профиль протянут по винтовой спирали (sweep_helix)
from vcad import Scene, Plane

wire_r, coil_r, pitch, height = 2.0, 18.0, 6.0, 50.0
scene = Scene()
body = scene.add_body(name="Spring")

profile = body.start_sketch(plane=Plane.XY)
profile.circle(center=(0, 0), radius=wire_r)   # профиль у начала координат — на спираль его выносит radius=
body.sweep_helix(profile, pitch=pitch, height=height, radius=coil_r)`,`# Сквозное отверстие Ø6 в цилиндре-ПРИМИТИВЕ сверху
# Примитив отцентрован: тело z ∈ [-H/2, +H/2], верх на z=+H/2 — НЕ на z=H!
from vcad import Scene, Plane

R, H, hole_r = 10.0, 20.0, 3.0
scene = Scene()
body = scene.add_body(name="DrilledCylinder")
body.cylinder(radius=R, height=H)                  # тело: z от -10 до +10
sk = body.start_sketch(plane=Plane.XY, offset=H / 2)   # эскиз на ВЕРХНЕЙ грани (z=+10)
sk.circle(center=(0, 0), radius=hole_r)
body.cut(sk, height=0, height_backward=H + 1)      # режем ВНИЗ сквозь всё тело`,`# Фланец с кольцом болтовых отверстий через цикл for.
# КЛЮЧЕВОЙ ПРИЁМ: один эскиз на ВСЕ отверстия. В цикле for только РИСУЕМ
# окружности, а вырез делаем ОДИН раз после цикла — ASCAD трактует несколько
# окружностей в одном эскизе как отдельные отверстия и режет их все сразу.
from vcad import Scene, Plane
import math

R_flange, thickness = 40.0, 8.0
n_bolts, r_circle, r_bolt = 6, 28.0, 3.5
scene = Scene()
body = scene.add_body(name="Flange")

disk = body.start_sketch(plane=Plane.XY)
disk.circle(center=(0, 0), radius=R_flange)
body.extrude(disk, height=thickness)

holes = body.start_sketch(plane=Plane.XY, offset=thickness)   # ОДИН эскиз на все отверстия
for i in range(n_bolts):
    a = 2 * math.pi * i / n_bolts
    holes.circle(center=(r_circle * math.cos(a), r_circle * math.sin(a)), radius=r_bolt)
body.cut(holes, height=0, height_backward=thickness + 1)      # ОДИН вырез — все отверстия сразу`].map(e=>"```python\n"+e+"\n```").join(`

`),J=`Ты — генератор параметрических 3D-моделей для CAD-редактора ASCAD.
По запросу пользователя ты пишешь Python-скрипт на библиотеке vcad-py, который строит запрошенную деталь.

${G}

Жёсткие правила:
- Ответ должен содержать РОВНО ОДИН блок \`\`\`python с полным скриптом.
- Скрипт ОБЯЗАН оставить переменную верхнего уровня \`scene\` типа \`Scene\`.
- При уточнении/правке ВСЕГДА перегенерируй весь скрипт целиком с нуля: начинай с \`scene = Scene()\` и строй деталь заново с учётом правки. НЕ читай и НЕ изменяй \`scene.bodies\`, не удаляй и не ищи существующие тела — просто выдай полный новый скрипт.
- НЕ вызывай scene.save(), не пиши файлы, не используй argparse, __main__ или функцию main() — только код верхнего уровня.
- Импортируй только из \`vcad\` и из стандартного \`math\`. Никаких других библиотек.
- Используй ТОЛЬКО методы из шпаргалки выше; не выдумывай несуществующие.
- Единицы — миллиметры. Числовые параметры выноси в именованные переменные сверху, чтобы модель легко было перенастроить.
- Примитивы отцентрованы по началу координат — НЕ считай, что основание на z=0. У цилиндра/куба высотой H верх на z=+H/2, низ на z=−H/2. Чтобы просверлить отверстие сверху примитива высотой H: start_sketch(plane=Plane.XY, offset=H/2), затем body.cut(sketch, height=0, height_backward=H+запас) — режем ВНИЗ сквозь тело.
- cut без height_backward режет симметрично (в обе стороны от плоскости эскиза), поэтому для надёжного сквозного выреза всегда задавай height_backward, перекрывающий толщину тела.
- Для сквозных отверстий в эскиз+экструд деталях: эскиз окружности на offset=толщина, затем body.cut(..., height=0, height_backward=толщина+запас).
- Несколько одинаковых отверстий (кольцо болтов, сетка, ряд) — рисуй ВСЕ окружности в ОДНОМ эскизе циклом for, затем сделай ОДИН body.cut(...). ASCAD трактует несколько окружностей в одном эскизе как отдельные отверстия и вырежет их разом. НЕ создавай отдельный эскиз и отдельный вырез на каждое отверстие.
- fillet_3d/chamfer_3d требуют 3D-координат концов ребра — применяй их только когда геометрию рёбер можно вычислить точно; иначе предпочитай форму через эскизы.
- Если размеры не заданы — выбери разумные значения по умолчанию (детали порядка 10–100 мм) и вынеси их в переменные сверху; не оставляй параметры пустыми.
- Профиль эскиза не должен самопересекаться, а у revolve — пересекать ось; иначе OCCT не построит тело.
- Запрос всегда понимай как «построй 3D-деталь». Если он совсем не про геометрию — всё равно верни простой осмысленный скрипт (например, табличку с надписью), но ОБЯЗАТЕЛЬНО оставь рабочую переменную scene. Никогда не отвечай без блока кода.
- Краткие комментарии на русском приветствуются, но главное — рабочий код.

Примеры (стиль и API; повторяй этот стиль):

${K}`;function U(e){return e.length?`В сцене уже есть тела: ${e.map(n=>`«${n}»`).join(", ")}. Если пользователь просит изменить существующее — учитывай это; иначе создавай новую сцену.`:null}async function V(e,n={}){const{bodyNames:r=[],history:h=[],maxAttempts:a=3,signal:m,onProgress:p}=n,k=U(r),y=[{role:"system",content:J},...k?[{role:"user",content:k}]:[],...h,{role:"user",content:e}];let f=x("pyed.ai.unknownError");const d=()=>{if(m?.aborted)throw new DOMException("Aborted","AbortError")};for(let o=1;o<=a;o++){d(),p?.(x("pyed.ai.generating",{attempt:o,max:a}));const u=await L(y,{signal:m}),g=$(u);if(!g){f=x("pyed.ai.noCodeBlock"),y.push({role:"assistant",content:u},{role:"user",content:"Верни ровно один блок ```python с полным скриптом, создающим переменную scene."});continue}p?.(x("pyed.ai.checking",{attempt:o,max:a}));const l=await O(g);if(d(),l.ok)return{code:g,scene:l.scene,attempts:o};f=l.traceback,y.push({role:"assistant",content:u},{role:"user",content:`Скрипт упал с ошибкой:
\`\`\`
${l.traceback}
\`\`\`
Исправь и верни полный рабочий скрипт заново.`})}throw new Error(x("pyed.ai.noWorkingScript",{max:a,error:f}))}const q=/нов(ое|ый|ую|ая)\s+(тел|деталь|модел)|нарисуй\s+заново|\bзаново\b|с\s+нуля/i;function se(){const e=X(),n=R(t=>t.loadCode),r=T(t=>t.show),h=D(t=>t.setOpen),[a,m]=i.useState(""),[p,k]=i.useState(!1),[y,f]=i.useState(""),[d,o]=i.useState([]),u=i.useRef(null),g=i.useRef(null),l=i.useRef(null);i.useEffect(()=>{g.current?.scrollIntoView({behavior:"smooth"})},[d,y]),i.useEffect(()=>()=>l.current?.abort(),[]);const H=i.useCallback(()=>{o([]),u.current=null,r(e("pyed.notify.contextReset"),"info")},[r,e]),P=i.useCallback(async()=>{const t=a.trim();if(!t||p)return;const _=q.test(t);_&&(u.current=null);const z=_?[]:d,A=z.map(c=>({role:c.role,content:c.role==="assistant"?`\`\`\`python
${c.text}
\`\`\``:c.text}));k(!0),f(e("pyed.ai.connecting")),o(_?[{role:"user",text:t}]:[...z,{role:"user",text:t}]),m("");const w=new AbortController;l.current=w;try{A.length===0&&(u.current=B());const c=u.current,S=F.getState().scene.bodies.map(v=>v.name),b=await V(t,{bodyNames:S,history:A,signal:w.signal,onProgress:f});if(w.signal.aborted)return;const{bodyCount:N}=await I(b.scene,{replaceBodyId:c});n(b.code,c),o(v=>[...v,{role:"assistant",text:b.code,note:e("pyed.ai.doneNote",{attempts:b.attempts,count:N})}]),r(e("pyed.notify.sceneGenerated"),"success")}catch(c){if(w.signal.aborted){o(b=>[...b,{role:"assistant",text:"",note:e("pyed.ai.cancelledNote")}]);return}const S=c instanceof Error?c.message:String(c);o(b=>[...b,{role:"assistant",text:"",note:e("pyed.ai.errorNote",{msg:S})}]),r(e("pyed.notify.generateFailed"),"error")}finally{l.current=null,k(!1),f("")}},[a,p,d,n,r,e]);return s.jsxs(M,{dragKey:"ai-agent",width:"w-[360px]",resizable:!0,icon:s.jsx(j,{size:14,className:"text-purple-400"}),title:e("pyed.ai.title"),onClose:()=>h(!1),closeTitle:e("pyed.ai.closeTitle"),headerExtra:s.jsxs("button",{onClick:H,disabled:p||d.length===0,className:"flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-cad-muted hover:text-cad-text hover:bg-cad-hover disabled:opacity-40 disabled:hover:bg-transparent transition",title:e("pyed.ai.newBodyTitle"),children:[s.jsx(Z,{size:13})," ",e("pyed.ai.newBody")]}),children:[s.jsxs("div",{className:"px-3 pt-2 pb-2 space-y-2 overflow-y-auto text-xs flex-1 min-h-[200px]",children:[d.length===0&&!y&&s.jsx("p",{className:"text-cad-muted",children:e("pyed.ai.intro")}),d.map((t,_)=>s.jsx("div",{className:t.role==="user"?"text-right":"text-left",children:s.jsxs("div",{className:"inline-block max-w-[90%] rounded px-2 py-1 text-left "+(t.role==="user"?"bg-blue-600 text-white":"bg-cad-bg text-cad-text"),children:[t.note&&s.jsx("div",{className:"mb-0.5 "+(t.text?"text-green-400":"text-cad-error"),children:t.note}),t.role==="assistant"&&t.text&&s.jsx("pre",{className:"whitespace-pre-wrap font-mono text-[11px] max-h-32 overflow-auto",children:t.text}),t.role==="user"&&s.jsx("span",{className:"whitespace-pre-wrap",children:t.text})]})},_)),y&&s.jsxs("div",{className:"flex items-center gap-1.5 text-cad-muted",children:[s.jsx(E,{size:12,className:"animate-spin"}),y]}),s.jsx("div",{ref:g})]}),s.jsxs("div",{className:"flex items-end gap-1.5 px-3 pb-3 pt-1 border-t border-cad-border flex-shrink-0",children:[s.jsx("textarea",{value:a,onChange:t=>m(t.target.value),onKeyDown:t=>{t.key==="Enter"&&!t.shiftKey&&(t.preventDefault(),P())},disabled:p,rows:2,placeholder:e("pyed.ai.promptPlaceholder"),className:"flex-1 min-w-0 resize-y px-2 py-1 rounded bg-cad-bg border border-cad-border text-xs text-cad-text placeholder:text-cad-muted focus:outline-none focus:border-cad-accent disabled:opacity-50"}),p?s.jsxs("button",{onClick:()=>l.current?.abort(),className:"flex items-center gap-1 px-2 py-1.5 rounded bg-red-600 text-white text-xs hover:opacity-90 transition flex-shrink-0",title:e("pyed.ai.cancelTitle"),children:[s.jsx(E,{size:14,className:"animate-spin"}),e("pyed.ai.cancel")]}):s.jsxs("button",{onClick:()=>void P(),disabled:!a.trim(),className:"flex items-center gap-1 px-2 py-1.5 rounded bg-purple-600 text-white text-xs hover:opacity-90 disabled:opacity-50 transition flex-shrink-0",title:d.length?e("pyed.ai.refineTitle"):e("pyed.ai.generateTitle"),children:[s.jsx(j,{size:14}),e("pyed.ai.generate")]})]})]})}export{se as default};
