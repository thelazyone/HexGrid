private var ThisHex : GameObject;
var GridPosition : Vector3;
var IsSelected : boolean;
var Occupied : boolean = false;
var flag = "token";

function Start(){
	ThisHex = gameObject;
	globalStuff.tokenCounter = globalStuff.tokenCounter + 1;
}

function OnMouseEnter(){
	ThisHex.renderer.material.color = Color.red;
}

function OnMouseExit(){
	if(!IsSelected){
		ThisHex.renderer.material.color = Color.white;
	}else{
		ThisHex.renderer.material.color = Color.blue;
	}
}