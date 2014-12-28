var Cam1 : Camera;
var CameraHeight : float = 3.0;
var CameraAngle : float = 65;
var CameraSpeed : float = 2;
var MinZoom : float = 1;
var HexGrid : GameObject;
var Cube : GameObject;
var MapSize : Vector2;
var CurrentHex : GameObject;
var HoveredHex : GameObject;
var Distance : int;

private var MoveVector : Vector3;
private var pos : Vector3;
private var HexExt : Vector2;
private var HexSize : Vector2;
private var HexInfo : Vector3;
private var MouseHex : RaycastHit;
private var Cam2 : Camera;
private var Cam1T : Transform;
private var Cam2T : Transform;
private var MousePos : Vector2;
private var Cam1Lead : boolean;
private var HexList : Array;

function Awake(){
	GetHexProperties();
	GenerateMap();
}

function GetHexProperties(){
	// TODO: Remove useless instantiation please
	Inst = Instantiate(HexGrid, Vector3.zero, Quaternion.identity);
	HexExt = Vector2(Inst.gameObject.collider.bounds.extents.x, Inst.gameObject.collider.bounds.extents.z);
	HexSize = Vector2(Inst.gameObject.collider.bounds.size.x, Inst.gameObject.collider.bounds.size.z);
	Destroy(Inst);
	if((MapSize.y % 2) == 0)
		MapSize.y += 1;
}

function GenerateMap(){
	var HexMap : GameObject = new GameObject("HexMap");
	HexList = new Array();
	HexMap.transform.position = Vector3.zero;
	for (h = 0; h < MapSize.y; h++){
		even = h % 2;
		for(w = 0; w < MapSize.x - even; w++){
			newHex = Instantiate (HexGrid, Vector3.zero, Quaternion.identity);
			newHex.transform.position = Vector3(w * ((HexExt.x * 2)) + (HexExt.x * even), 0, (h * HexExt.y) * 1.5);
			if(h > 1 + even){
				newHex.GetComponent(FX_HexInfo).GridPosition = Vector3(w - Mathf.Round((h / 2) + .1),h, -(w - Mathf.Round((h / 2) + .1) + h));
			}else{
				newHex.GetComponent(FX_HexInfo).GridPosition = Vector3(w,h, -w - h * even);
			}
			newHex.transform.parent = HexMap.transform;
			HexList.Add(newHex);
		}
	}
}

function Start(){
	SetupCameras();
}

function SetupCameras(){
	// Note: Cam1T is a pointer to the transform of Cam1
	Cam1T = Cam1.transform;		
	Cam1T.localEulerAngles.x = CameraAngle;
	Cam1T.position = Vector3((HexExt.x * MapSize.x) * 1, CameraHeight, (HexExt.y * MapSize.y) * .75);
}

function Update() {
	HandleMouse();
	CalculateDistance();
	UpdateCamera();
}

function HandleMouse(){
	MousePos = Input.mousePosition;
	var ray1 = Cam1.ScreenPointToRay(MousePos);
	if (Physics.Raycast(ray1, MouseHex, 100)){
		HoveredHex = MouseHex.collider.gameObject;
		if(Input.GetMouseButtonDown(0)){
			SelectHex(HoveredHex);
		}
		
		if(Input.GetMouseButtonDown(1)){
			GW = Instantiate (Cube, MouseHex.collider.transform.position, Quaternion.identity);	
			GW.GetComponent(FX_HexInfo).GridPosition = HoveredHex.GetComponent(FX_HexInfo).GridPosition;
		}
	}
}

function SelectHex(selectedHex : GameObject){
	if(CurrentHex != null){
		CurrentHex.renderer.material.color = Color.white;
		CurrentHex.GetComponent(FX_HexInfo).IsSelected = false;
	}
	CurrentHex = selectedHex;
	CurrentHex.renderer.material.color = Color.blue;
	CurrentHex.GetComponent(FX_HexInfo).IsSelected = true;
}

function CalculateDistance(){
	if ( HoveredHex == null || CurrentHex == null ) return;
	dx = Mathf.Abs(HoveredHex.GetComponent(FX_HexInfo).GridPosition.x - CurrentHex.GetComponent(FX_HexInfo).GridPosition.x);
	dy = Mathf.Abs(HoveredHex.GetComponent(FX_HexInfo).GridPosition.y - CurrentHex.GetComponent(FX_HexInfo).GridPosition.y);
	dz = Mathf.Abs(HoveredHex.GetComponent(FX_HexInfo).GridPosition.z - CurrentHex.GetComponent(FX_HexInfo).GridPosition.z);

	var DistA : int = Mathf.Max(dx, dy, dz);
	var DistB : int = Mathf.Abs(DistA - Mathf.Abs(MapSize.x + dy));	

	Distance = Mathf.Min(DistA, DistB);
}

function UpdateCamera(){
	if(Input.GetKey(KeyCode.D)){
		MoveVector.x = 1;
	}else if(Input.GetKey(KeyCode.A)){
		MoveVector.x = -1;
	}else{
		MoveVector.x = 0;
	}
	
	if(Input.GetKey(KeyCode.W)){
		MoveVector.z = 1;
	}else if(Input.GetKey(KeyCode.S)){
		MoveVector.z = -1;
	}else{
		MoveVector.z = 0;
	}
		
	if (Input.GetAxis("Mouse ScrollWheel") > 0){
		MoveVector.y = -5;
    }else if(Input.GetAxis("Mouse ScrollWheel") < 0){
		MoveVector.y = 5;
    }else{
		MoveVector.y = 0;
	}
	
	Cam1T.Translate(MoveVector * (CameraSpeed * Time.deltaTime), Space.World);
	if ( Cam1T.position.y < MinZoom )
		Cam1T.position.y = MinZoom;
}

function OnGUI(){
	GUI.Label(Rect(20,0,100,20), HoveredHex.GetComponent(FX_HexInfo).GridPosition.ToString());
	GUI.Label(Rect(20,30,100,20), Distance.ToString("Distance: #."));
}