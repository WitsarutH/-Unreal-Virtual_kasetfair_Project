import { int, Scene } from "@babylonjs/core";
import { 
    AdvancedDynamicTexture, Button, Control, Image, StackPanel, TextBlock
} from "@babylonjs/gui";

import { CreateJoystickController } from "./CreateVirtualJoystick";
import { CreateFPController } from "./CreateFirstPerson";

// run 'npm i @babylonjs/gui'
// https://gui.babylonjs.com/

const _shopGUI = "#2MPG74#11"
const _mainGUI = "#XZ8RQX#23"
const _cartGUI = "#RPJ1SG#5"

const itemList: Array<string> = 
['Beer','Muffin','Cola','Enegy drink','KU Map','Apple'];

const imageList: Array<string> = 
['beer.png','muffin.png','cola.png','enegy.png','kumap.png','apple.png'];

const priceList : Array<number> = 
[120,50,30,40,20,15];

const cartList : Array<number> =
[];

let money = 1000;
let totalPrice = 0;

    export const mainGUI = async function(advancedTexture:AdvancedDynamicTexture,scene:Scene) {
        await advancedTexture.parseFromSnippetAsync(_mainGUI);
       
        const moneyText = new TextBlock();
        moneyText.text = "Money : "+ money;
        moneyText.color = "blue";
        moneyText.height = "50px";
        moneyText.fontSize = 40;
        moneyText.top = "-365px";
        moneyText.left = "660px";
        moneyText.outlineColor = "white";
        moneyText.outlineWidth = 10;
        advancedTexture.addControl(moneyText);

        const cartButton = Button.CreateImageOnlyButton("cart","./images/cart.png");
        cartButton.top = "350px"
        cartButton.left = "750px"
        cartButton.width = "65px"
        cartButton.height = "65px"
        cartButton.background ="#4581F3FF"
        advancedTexture.addControl(cartButton);
        

        const changeView = advancedTexture.getControlByName("changeView");
        const changeSkin = advancedTexture.getControlByName("changeSkin");
        changeSkin!.isVisible = false;

        // changeSkin!.onPointerUpObservable.add(() => {
        //     shopGUI(advancedTexture,6);
        // });
        
        changeView!.onPointerUpObservable.add(() => {
            CreateJoystickController(scene);
        });

        cartButton!.onPointerUpObservable.add(() => {
            cartGUI(advancedTexture,scene);
        });
    }

    export const shopGUI = async function(advancedTexture:AdvancedDynamicTexture,index:int,scene:Scene){
        await advancedTexture.parseFromSnippetAsync(_shopGUI);

        //โชว์รูปภาพในหน้าร้านค้า
        const img = new Image("image","./images/"+imageList[index])
        img.width = "300px";
        img.height = "300px";
        img.top = "-100px";
        advancedTexture.addControl(img);

        //โชว์จำนวนเงิน
        const moneyText = new TextBlock();
        moneyText.text = "Money : "+ money;
        moneyText.color = "blue";
        moneyText.height = "50px";
        moneyText.fontSize = 40;
        moneyText.top = "-365px";
        moneyText.left = "660px";
        moneyText.outlineColor = "white";
        moneyText.outlineWidth = 10;
        advancedTexture.addControl(moneyText);

        //โชว์ชื่อสินค้า
        const nameText = new TextBlock();
        nameText.text = itemList[index];
        nameText.fontSize = 60;
        nameText.top = "100px";
        nameText.width = "1000px";
        nameText.height = "70px";
        advancedTexture.addControl(nameText);

        //โชว์ราคาสินค้า
        const price = new TextBlock();
        price.text = "Price : " + priceList[index].toString();
        price.fontSize = 30;
        price.top = "190px";
        price.width = "300px";
        price.height = "40px";
        price.color = "green";
        price.textWrapping = true;
        advancedTexture.addControl(price);

        const closeButton = advancedTexture.getControlByName("closeButton");
        const addToCart = advancedTexture.getControlByName("addToCart");

        //ปุ่มย้อนกลับ
        closeButton!.onPointerUpObservable.add(() => {
            mainGUI(advancedTexture,scene);
        });

        //ปุ่มเพิ่มสินค้าลงตะกร้า
        addToCart!.onPointerUpObservable.add(() => {
            totalPrice += priceList[index];
            cartList.push(index);
            mainGUI(advancedTexture,scene);
        });
    }

    //หน้าต่างตะกร้าสินค้า
    export const cartGUI = async function(advancedTexture:AdvancedDynamicTexture,scene:Scene){
        await advancedTexture.parseFromSnippetAsync(_cartGUI);
        const closeButton = advancedTexture.getControlByName("closeButton");
        const buyButton = advancedTexture.getControlByName("buyButton");

    //แสดงจำนวนเงินที่มี
        const moneyText = new TextBlock();
        moneyText.text = "Money : "+ money;
        moneyText.height = "50px";
        moneyText.color = "blue";
        moneyText.fontSize = 40;
        moneyText.top = "-365px";
        moneyText.left = "660px";
        moneyText.outlineColor = "white";
        moneyText.outlineWidth = 10;
        advancedTexture.addControl(moneyText);
        
        //แสดงข้อความเมื่อตะกร้าสินค้าว่าง
        const alertText = new TextBlock();
        alertText.text = "Your cart is empty!"
        alertText.color = "red";
        alertText.fontSize = 60;
        alertText.width = "900px";
        alertText.height = "400px";
        advancedTexture.addControl(alertText);
        if (cartList.length != 0){
            alertText.isVisible = false;
        }

        //แสดงข้อความรวมเงิน
        const total = new TextBlock();
        total.text = "Total price : " + totalPrice;
        total.fontSize = 35;
        total.color = "green"
        total.top = "274px";
        total.left = "313px";
        total.width = "400px";
        total.height = "40px";
        advancedTexture.addControl(total);

        //Item list
        const items = new StackPanel();
        items.width = "400px";
        items.height = "440px";
        items.left = "-200px";
        advancedTexture.addControl(items);

        //Button list
        const buttons = new StackPanel();
        buttons.width = "250px";
        buttons.height = "440px";
        buttons.left = "200px";
    
        advancedTexture.addControl(buttons);
        
        //loop to create list
        for(const i in cartList){
            const text = new TextBlock("text"+ i);
            text.text = itemList[cartList[i]] + "          Price: " + priceList[cartList[i]];
            text.fontSize = 30;
            text.height = "75px";
            text.paddingBottom = 10;
            text.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
            items.addControl(text);
            
            const button = Button.CreateSimpleButton("button"+i,"Remove")
            const index = cartList[i];
            button.height = "75px"
            button.background = "red"
            button.fontSize = 30;
            button.paddingBottom = 10;  
            button!.onPointerUpObservable.add(() =>{
                cartList.splice(cartList.indexOf(cartList[i]),1);
                cartGUI(advancedTexture,scene);
                totalPrice -= priceList[index] ;
            })
            buttons.addControl(button)
        }
        //ย้อนกลับไปหน้าแรก
        closeButton!.onPointerUpObservable.add(() =>{
            mainGUI(advancedTexture,scene);
        });
        //ปุ่มซื้อสินค้า
        buyButton!.onPointerUpObservable.add(() =>{
            if(money >= totalPrice && totalPrice != 0){
                money -= totalPrice;
                totalPrice = 0;
                cartList.splice(0);
                alert("Buy Success!");
                mainGUI(advancedTexture,scene);
            }else if(money < totalPrice){
                alert("You don't have enough money!");
            }else if(totalPrice == 0){
                alert("Your cart is empty!")
            }
        });
    }

    