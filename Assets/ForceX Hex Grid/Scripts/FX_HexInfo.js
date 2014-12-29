private var ThisHex : GameObject;
var IsSelected : boolean;
var RealColor : Color = Color.white;
private var Occupied : boolean = false;
var Cube : GameObject;
var ID : int;

function Start(){
	ThisHex = gameObject;
}
//since there is no "OnRightClick" function, i've to loop when the mouse is on the element.
function OnMouseOver () {
	//left click: selects the hex and deselects the previous one.
    if(Input.GetMouseButtonDown(0)){
		//deselect the previously selected hex, if any
		if (PublicVars.CurrentHex != null)
			PublicVars.CurrentHex.GetComponent(FX_HexInfo).Unselect();
		PublicVars.CurrentHex = ThisHex;
		//deselect the previously selected token, if any
		if (PublicVars.CurrentObject != null)
			PublicVars.CurrentObject.GetComponent(FX_TokenInfo).Unselect();	
		//selects the current Hex
		Select();
	} 
	//right click: creates a cube if the hex is not occupied already.
	if(Input.GetMouseButtonDown(2)){
		//if the hex is free, it creates a new token.
		if (!Occupied){
			GW = Instantiate (Cube, ThisHex.collider.transform.position, Quaternion.identity);	
			GW.GetComponent(Coordinates).GridPosition = ThisHex.GetComponent(Coordinates).GridPosition;
			//GW.GetComponent(FX_TokenInfo).OccupiedHex = ThisHex;
			Occupied = true;
		}
	}
}
//sets the colour to blue.
function Select(){
	ThisHex.renderer.material.color = Color.blue;
	RealColor = ThisHex.renderer.material.color;
}
//sets the colour to white - transparent.
function Unselect(){
	ThisHex.renderer.material.color = Color.white;
	RealColor = ThisHex.renderer.material.color;
}
//When the mouse is over the hex, the colour is red.
function OnMouseEnter(){
	ThisHex.renderer.material.color = Color.red;
}
//when the mouse leaves, the colour is restored to normal.
function OnMouseExit(){
	ThisHex.renderer.material.color = RealColor;
}