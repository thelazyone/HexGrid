var Cam1 : Camera;
var CameraHeight : float = 3.0;
var CameraAngle : float = 65;
var CameraSpeed : float = 2;
var MinZoom : float = 1;
var HexGrid : GameObject;
var MapSize : Vector2;
var HoveredObject : GameObject;
var Distance : int;

private var MoveVector : Vector3;
private var pos : Vector3;
private var HexExt : Vector2;
private var HexSize : Vector2;
private var HexInfo : Vector3;
private var MouseObject : RaycastHit;
private var Cam2 : Camera;							//USELESS?
private var Cam1T : Transform;
private var Cam2T : Transform;						//USELESS?
private var MousePos : Vector2;
private var Cam1Lead : boolean;						//USELESS?
private var HexList : Array;

class PublicVars {
	static var CurrentHex : GameObject = null;
	static var HoveredObject : GameObject = null;
	static var CurrentObject : GameObject = null;
	static var PublicHexList = new Array();
}

/*
function FindHex(SearchCoordinates : Vector3) : GameObject{
		for (var searchHex in HexList){
			if (searchHex.GetComponent(Coordinates).GridPosition == SearchCoordinates)
				return searchHex;
		}
}	
*/

function Awake(){
	GetHexProperties();
	GenerateMap();
	PublicVars.PublicHexList = HexList;
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
	var CounterID : int = 0;
	var HexMap : GameObject = new GameObject("HexMap");
	HexList = new Array();
	HexMap.transform.position = Vector3.zero;
	for (h = 0; h < MapSize.y; h++){
		even = h % 2;
		for(w = 0; w < MapSize.x - even; w++){
			newHex = Instantiate (HexGrid, Vector3.zero, Quaternion.identity);
			newHex.transform.position = Vector3(w * ((HexExt.x * 2)) + (HexExt.x * even), 0, (h * HexExt.y) * 1.5);
			if(h > 1 + even){
				newHex.GetComponent(Coordinates).GridPosition = Vector3(w - Mathf.Round((h / 2) + .1),h, -(w - Mathf.Round((h / 2) + .1) + h));
			}else{
				newHex.GetComponent(Coordinates).GridPosition = Vector3(w,h, -w - h * even);
			}
			newHex.transform.parent = HexMap.transform;
			newHex.GetComponent(FX_HexInfo).ID = CounterID;
			CounterID = CounterID + 1;
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
	if (Physics.Raycast(ray1, MouseObject, 100)){
		HoveredObject = MouseObject.collider.gameObject;
		PublicVars.HoveredObject = HoveredObject;
	}
}

function CalculateDistance(){
	if ( HoveredObject == null || PublicVars.CurrentHex == null ) return;
	dx = Mathf.Abs(HoveredObject.GetComponent(Coordinates).GridPosition.x - PublicVars.CurrentHex.GetComponent(Coordinates).GridPosition.x);
	dy = Mathf.Abs(HoveredObject.GetComponent(Coordinates).GridPosition.y - PublicVars.CurrentHex.GetComponent(Coordinates).GridPosition.y);
	dz = Mathf.Abs(HoveredObject.GetComponent(Coordinates).GridPosition.z - PublicVars.CurrentHex.GetComponent(Coordinates).GridPosition.z);

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
	GUI.Label(Rect(20,0,100,20), HoveredObject.GetComponent(Coordinates).GridPosition.ToString());
	GUI.Label(Rect(20,30,100,20), Distance.ToString("Distance: #."));
}