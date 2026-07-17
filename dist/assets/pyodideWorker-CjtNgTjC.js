const f="0.29.4",l="/py/vcad_py-0.1.11-py3-none-any.whl",u=`https://cdn.jsdelivr.net/pyodide/v${f}/full/`,y=`
import io, contextlib, json, traceback
from vcad import Scene
try:
    from vcad import Assembly
except Exception:
    Assembly = None

def _vcad_find(ns, cls, name):
    obj = ns.get(name)
    if isinstance(obj, cls):
        return obj
    return next((v for v in ns.values() if isinstance(v, cls)), None)

def _vcad_run(user_code):
    ns = {}
    out = io.StringIO()
    try:
        with contextlib.redirect_stdout(out):
            exec(user_code, ns)
    except Exception:
        return json.dumps({"ok": False, "stdout": out.getvalue(),
                           "traceback": traceback.format_exc()})
    # An Assembly (if the script built one) takes priority over a Scene.
    asm = _vcad_find(ns, Assembly, "assembly") if Assembly is not None else None
    if asm is not None:
        return json.dumps({"ok": True, "kind": "assembly", "stdout": out.getvalue(), "scene": asm.to_dict()})
    scene = _vcad_find(ns, Scene, "scene")
    if scene is None:
        return json.dumps({"ok": False, "stdout": out.getvalue(),
                           "traceback": "No vcad.Scene or vcad.Assembly found. Create one, e.g.  scene = Scene()  or  assembly = Assembly()"})
    return json.dumps({"ok": True, "kind": "scene", "stdout": out.getvalue(), "scene": scene.to_dict()})

# ── Step debugger ─────────────────────────────────────────────────────────────
# Split the script into top-level statements and exec them one at a time into a
# PERSISTENT namespace, so the editor can step through and render the partial
# scene after each statement. (Statement granularity: a for-loop / function body
# runs as one step — line-level stepping into loops would need sys.settrace +
# suspend/resume, out of scope for v1.)

def _scene_of(ns):
    scene = ns.get("scene")
    if not isinstance(scene, Scene):
        scene = next((v for v in ns.values() if isinstance(v, Scene)), None)
    return scene

_dbg = {"ns": None, "stmts": None, "idx": 0}

def _vcad_dbg_prepare(user_code):
    import ast
    try:
        tree = ast.parse(user_code)
    except Exception:
        return json.dumps({"ok": False, "done": True, "traceback": traceback.format_exc(), "stdout": ""})
    stmts = []
    for node in tree.body:
        mod = ast.Module(body=[node], type_ignores=[])
        stmts.append((compile(mod, "<editor>", "exec"), node.lineno))
    _dbg["ns"] = {}
    _dbg["stmts"] = stmts
    _dbg["idx"] = 0
    lines = [ln for (_c, ln) in stmts]
    return json.dumps({"ok": True, "done": len(stmts) == 0, "numStmts": len(stmts),
                       "lines": lines, "nextLine": (lines[0] if lines else None),
                       "scene": None, "stdout": ""})

def _dbg_envelope(executed_line, out_value, tb=None):
    stmts = _dbg["stmts"] or []
    done = _dbg["idx"] >= len(stmts)
    next_line = None if done else stmts[_dbg["idx"]][1]
    scene = _scene_of(_dbg["ns"]) if _dbg["ns"] is not None else None
    return json.dumps({"ok": tb is None, "done": bool(done) or (tb is not None),
                       "executedLine": executed_line, "nextLine": next_line,
                       "scene": (scene.to_dict() if scene is not None else None),
                       "stdout": out_value, "traceback": tb})

def _vcad_dbg_step():
    stmts = _dbg["stmts"]
    if stmts is None:
        return json.dumps({"ok": False, "done": True, "traceback": "NO_DEBUG_SESSION", "stdout": ""})
    if _dbg["idx"] >= len(stmts):
        return _dbg_envelope(None, "")
    code, line = stmts[_dbg["idx"]]
    out = io.StringIO()
    try:
        with contextlib.redirect_stdout(out):
            exec(code, _dbg["ns"])
        _dbg["idx"] += 1
        return _dbg_envelope(line, out.getvalue())
    except Exception:
        _dbg["idx"] += 1
        return _dbg_envelope(line, out.getvalue(), traceback.format_exc())

def _vcad_dbg_continue(breakpoints_json):
    stmts = _dbg["stmts"]
    if stmts is None:
        return json.dumps({"ok": False, "done": True, "traceback": "NO_DEBUG_SESSION", "stdout": ""})
    bps = set(json.loads(breakpoints_json))
    out = io.StringIO()
    last = None
    first = True
    try:
        with contextlib.redirect_stdout(out):
            while _dbg["idx"] < len(stmts):
                code, line = stmts[_dbg["idx"]]
                # Stop BEFORE a breakpoint line — but always make progress on the
                # statement we're currently paused at (first iteration).
                if not first and line in bps:
                    break
                exec(code, _dbg["ns"])
                last = line
                _dbg["idx"] += 1
                first = False
        return _dbg_envelope(last, out.getvalue())
    except Exception:
        _dbg["idx"] += 1
        return _dbg_envelope(last, out.getvalue(), traceback.format_exc())

def _vcad_dbg_reset():
    _dbg["ns"] = None
    _dbg["stmts"] = None
    _dbg["idx"] = 0
    return json.dumps({"ok": True, "done": True})
`;let a=null,p=null,_=null,b=null,m=null,g=null,d=null;function o(i){self.postMessage(i)}async function v(){o({type:"status",phase:"loading-pyodide"}),a=await(await import(`${u}pyodide.mjs`)).loadPyodide({indexURL:u}),o({type:"status",phase:"loading-packages"}),await a.loadPackage(["micropip","pydantic"]),o({type:"status",phase:"installing-vcad"});const s=await fetch(l);if(!s.ok)throw new Error(`VCAD_WHEEL_LOAD_FAILED:${s.status}`);const n=new Uint8Array(await s.arrayBuffer()),r=l.split("/").pop();a.FS.writeFile(`/tmp/${r}`,n),await a.runPythonAsync(`import micropip
await micropip.install('emfs:///tmp/${r}', deps=False)`),a.runPython(y),p=a.globals.get("_vcad_run");const e=t=>a.globals.get(t);_=e("_vcad_dbg_prepare"),b=e("_vcad_dbg_step"),m=e("_vcad_dbg_continue"),g=e("_vcad_dbg_reset"),o({type:"status",phase:"ready"})}function c(){return d||(d=v()),d}self.onmessage=async i=>{const s=i.data;if(s.type==="init"){c().catch(n=>o({type:"fatal",error:n?.message??String(n)}));return}if(s.type==="run"){const{id:n,code:r}=s;try{await c();const e=p(r),t=JSON.parse(e);t.ok?o({type:"result",id:n,ok:!0,kind:t.kind,scene:t.scene,stdout:t.stdout}):o({type:"result",id:n,ok:!1,traceback:t.traceback,stdout:t.stdout})}catch(e){const t=e instanceof Error?e.message:String(e);o({type:"result",id:n,ok:!1,traceback:t,stdout:""})}return}if(s.type==="debug"){const{id:n,action:r}=s;try{await c();let e;r==="prepare"?e=_(s.code??""):r==="step"?e=b():r==="continue"?e=m(JSON.stringify(s.breakpoints??[])):e=g(),o({type:"debug-result",id:n,...JSON.parse(e)})}catch(e){const t=e instanceof Error?e.message:String(e);o({type:"debug-result",id:n,ok:!1,done:!0,traceback:t,stdout:""})}}};
