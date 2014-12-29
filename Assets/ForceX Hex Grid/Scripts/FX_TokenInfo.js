private var ThisToken : GameObject;
var IsSelected : boolean;
var RealColor : Color = Color.white;

function Start(){
	ThisToken = gameObject;
}

function OnMouseOver () {
	//left click: selects the hex and deselects the previous one.
    if(Input.GetMouseButtonDown(0)){
		if (PublicVars.CurrentObject != null)
			PublicVars.CurrentObject.GetComponent(FX_TokenInfo).Unselect();
		Select();
		PublicVars.CurrentObject = ThisToken;
	} 
	/*
	if(Input.GetMouseButtonDown(1)){
		PublicVars.PublicHexList[30].GetComponent(FX_HexInfo).Select();
		PublicVars.PublicHexList[11].GetComponent(FX_HexInfo).Select();
		PublicVars.PublicHexList[44].GetComponent(FX_HexInfo).Select();
	} */
}

function Select(){
	ThisToken.renderer.material.color = Color.blue;
	RealColor = ThisToken.renderer.material.color;
	IsSelected = true;
}
//sets the colour to white - transparent.
function Unselect(){
	ThisToken.renderer.material.color = Color.white;
	RealColor = ThisToken.renderer.material.color;
	IsSelected = false;
}

function OnMouseEnter(){
	ThisToken.renderer.material.color = Color.red;
}

function OnMouseExit(){
	ThisToken.renderer.material.color = RealColor;
}


function Update(){
	if(Input.GetMouseButtonDown(1) && IsSelected && PublicVars.HoveredObject.name == "Hex(Clone)"){
		Debug.Log("cliccato!");
 		ThisToken.GetComponent(Coordinates).GridPosition = PublicVars.HoveredObject.GetComponent(Coordinates).GridPosition;
 		ThisToken.collider.transform.position = PublicVars.HoveredObject.collider.transform.position;
	} 
}

function FindHex(HexCoord : Vector3) : int{
	
}