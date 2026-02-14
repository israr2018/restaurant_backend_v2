// controllers/orderController.js
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const OrderModel = require('../models/orderModel');
const printer= require('pdf-to-printer');
// @desc    Create a new OrderMode
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const body = req.body;

   
  
  
    const order = new OrderModel({
      ...body
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.log('error creating order=>',error);
    res.status(500).json({ message: 'Error creating order', error });
  }
};
 
// @desc    Get all orders
// @route   GET /api/orders/3
// @access  Public
const getOrders = async (req, res) => {
  try {
    const {currentPage=1,pageSize=10,filterBy,filterCreatedBy}=req.query;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);
    const totalOrders = await OrderModel.countDocuments();
    const totalPages = Math.ceil(totalOrders / pageSize)
    let query={};
    const filterByStatus={
      PENDING:{ 
        paymentStatus:'PENDING',
        createdAt:{
          $gte: currentDate,
          $lte: endOfDay,
        }
      },

     PAID:{
      paymentStatus:'PAID',
      createdAt:{
        $gte: currentDate,
        $lte: endOfDay,
      }
    },

     TODAY_ALL:{
      createdAt:{
        $gte: currentDate,
        $lte: endOfDay,
      }
     }

    };
    if(filterBy){
      query= filterByStatus[filterBy];
     
    } 
    if(filterCreatedBy!='null'){

      query.createdBy=filterCreatedBy;
    }

  const itemsCount = await OrderModel.countDocuments(query);
  
  const orders= await OrderModel.find(
    query
    ).sort({createdAt:-1}).skip((currentPage-1)*pageSize).limit(pageSize).exec();
    const total= orders.reduce((total,order)=>total+=order.totalBill,0)

    res.json({allOrders:orders,accumulateTotal:total, itemsCount});
}
  catch (error) {
    console.log(`error===>${error}`);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// @desc    Get all orders
// @route   GET /api/orders/3
// @access  Public
const getOrder = async (req, res) => {
  try {
    const id= req.params.id;
    const retreivedOrder = await OrderModel.findById(id);
    if(!retreivedOrder) res.status(200).json({ message: '', error });
    res.json(retreivedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};
const updateOrder = async (req, res) => {
  try {
    // const id = req.params.id; // Correct way to get the route parameter
    const {order} = req.body; // Data to update the menu
    const {id}=req.params;

    // Using Mongoose to update the menu item by its ID
    const existingOrder = await OrderModel.findOne({_id:id});
    Object.keys(order).forEach((key) => {
      existingOrder[key] = order[key];
    });
    await existingOrder.save()
    // Return the updated menu if successful
    res.status(200).json(existingOrder);
  } catch (ex) {
    // Return a 500 status and the error message
    res.status(500).json({ message: "An error occurred", error: ex.message });
  }
};

  const receivePayment=async(req,res)=>{
  try{
      const {id}=req.params;
      const {recievedBy}=req.query;
      const existingOrder = await OrderModel.findOne({_id:id});
      existingOrder.paymentStatus='PAID';
      existingOrder.recievedBy=recievedBy;
      await existingOrder.save()
      return res.status(200).json({message: "Payment received!"} );
  }
  catch(ex){
      return res.status(500).json({ message: "An error occurred", error: ex.message });
  }
}

// const printReciept=async(req,res)=>{
//   try{

//       const {id}=req.params;
//       const existingOrder = await OrderModel.findOne({_id:id});
//       existingOrder.paymentStatus='PAID';
//       await existingOrder.save()
//       return res.status(200).json({message: "Payment received!"} );
//   }
//   catch(ex){
//       return res.status(500).json({ message: "An error occurred", error: ex.message });
//   }
// }

  const createReceipt=async(req,res)=>{
    try{
      const appData='src/data';
      const receiptSavedLocation=path.join(appData,'receipt.pdf');
      const {order}=req.body;
      await updatePrintStatus(order._id);
      const {error,stream}=await createPdfReceipt({order,receiptSavedLocation});
      if(error){
        // logger.error(`Error while creating pdf receipt:${error}`)
        return res.status(500).json({ message: "Error while creating pdf receipt ", error });
        
      }
      stream.on('finish',async()=>{
        const {failurReason}=await printReceipt(receiptSavedLocation);
        if(failurReason){
          return res.status(200).json({ message: "Printing document failed", error:failurReason});
        }
        return res.status(200).json({ message: "Printing document succeeded!", error:null});
    
      })
    }
    catch(ex){
      return res.status(200).json({ message: "Error while printing receipt", error: ex.message });
    }

  };
  const updatePrintStatus=async(id)=>{
    try {
      // Find the order by ID
      
      const order =await OrderModel.findOne({_id:id});
  
      if (!order) {
        throw new Error('Order not found');
      }
  
      // Check if any item has `printStatus` as `false`
      const hasUnprintedItems = order.orderItems.some(item => item.printStatus === false);
  
      if (hasUnprintedItems) {
        // Update `printStatus` of all items to `true`
        order.orderItems.forEach(item => {
          item.printStatus = true;
        });
  
        // Save the updated order
        await order.save();
        console.log(`order===>${JSON.stringify(order)}`);
      }
  
      return order; // Return the updated order
    } catch (error) {
      console.error('Error updating print status:', error);
      throw error;
    }
  }
  const createPdfReceipt=async({order,receiptSavedLocation})=> {
    try {
      // const {businessTitle,businessAddress,mobileNumber,thanksMessage}=businessInfo;
      
      const businessTitle = process.env.BUSINESS_TITLE;
      const businessAddress = process.env.BUSINESS_ADDRESS;
      const mobileNumber = process.env.MOBILE_NUMBER;
      const thanksMessage = process.env.THANKS_MESSAGE;
      const table = {
        headers: ['Item', 'Quanity', 'Price', 'Total'],
        rows: order.orderItems.filter(item=>item.printStatus===false)
      };
      // Create a new PDF document
      const doc = new PDFDocument({ autoFirstPage: false });
      const width=250;
      let docHeight=240+order.orderItems.length * 10;
      doc.addPage({ size: [width,docHeight],margin:2});
    
      // Create a writable stream to save the PDF
      const stream = fs.createWriteStream(receiptSavedLocation);
    
      // Pipe the PDF document to the stream
      doc.pipe(stream);
      // Set font size and style
      doc.fontSize(14);
    
      // Print the invoice header
      doc.text(`${businessTitle}`, { align: 'center' });
      doc.fontSize(10);
      // doc.moveDown();
      doc.text(`${businessAddress}`, { align: 'center' });
      doc.text(`Mobile#${mobileNumber}`, { align: 'center' });
      doc.moveDown();
      doc.text(`Table#:${order.tableNumber}`, { align: 'left' });
      doc.moveDown();
      doc.text(`Customer Name:${order.customerName}`, { align: 'left' });
      doc.moveDown();
      doc.text(`Order#:${order.orderNumber}`, { align: 'left' });
      doc.moveDown();
      doc.text(`Date:${getTodayDate()}`, { align: 'left' });
    
      const tableProps = {
        x: 5,
        y: doc.y + 10,
        w: width,
        h: 0,
        cellMargin: 40,
        
      };
      // Create the table
      let column0=tableProps.x;
      let column1=column0+(40/100)*tableProps.w;
      let column2=column1+(20/100)*tableProps.w;
      let column3=column2+(20/100)*tableProps.w;
      table.headers.forEach((header, index) => {
        doc.fontSize(10);
          switch(index){
            case 0:
              doc.text(header,column0,tableProps.y);
              break;
            case 1:
             doc.text(header,column1,tableProps.y);
             break;
            case 2:
              doc.text(header,column2,tableProps.y);
              break;
            case 3:
              doc.text(header,column3,tableProps.y);
              break;
            
          }
      });
    
      let y=tableProps.y+15;
      table.rows.forEach((row) => {
  
        doc.fontSize(10);
        doc.text(row.name,column0,y);
        doc.text(row.quantity,column1,y);
        doc.text(row.unitPrice,column2,y);
        doc.text(`${row.quantity * row.unitPrice}`,column3,y);
        y+=10;
        
      });
    
      y=y+10;
      doc.text(`Total: ${getOrderTotal(table.rows)}`,column3-30,y);
      y=y+10;
    
      doc.text(`${thanksMessage}`,tableProps.x+50,y);
      y+=10;
      doc.fontSize(8);
      
      y+=10;
    
      doc.text(`This App is build by Intech Solutions.`,tableProps.x+50,y);
      y+=10;
      doc.text(`Mobile#0318-9410953.`,(width/2)-30,y);
  
      doc.end();
      return {error:null,stream}
    } catch (error) {
      console.log(error);
      return {error,stream:null};
      
    }
  
   
    
  };
  const printReceipt=async(tempFile)=>{
    try{
      // logger.info(`file location:${tempFile}`);
      // const basePath="./node_module/pdf-to-printer/dist"
      const basePath = path.resolve('./node_modules/pdf-to-printer/dist');
      const absoluteTempFile = path.resolve(tempFile);
      // await printer.print(absoluteTempFile, {
      //   printer: "BC-96AC",
      //   sumatraPdfPath: path.join(basePath, 'SumatraPDF-3.4.6-32.exe'),
        
      // });
      await printer.print(absoluteTempFile, {
        sumatraPdfPath: path.join(basePath, 'SumatraPDF-3.4.6-32.exe'),
        
      });
      return {failurReason:null}
    }
    catch(err){
      console.log(`printing receipt error==>:${err}`);
      return {failurReason:err}
    }
  }

  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const getOrderTotal=(orderItems)=>orderItems.reduce((total,{unitPrice,quantity})=>total+unitPrice*quantity,0)
  module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    receivePayment,
    createReceipt
  };
