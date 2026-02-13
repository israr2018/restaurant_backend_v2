const OrderModel = require('../models/orderModel');
  const getSaleReport=async(req,res)=>{
    try{
        const {currentPage,pageSize,filterByDate,dateRangeFilter}=req.body;
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);
        let dateFilter={};
  
        if(dateRangeFilter && Object.keys(dateRangeFilter).length!==0){
            const filter={
            $gte: new Date(dateRangeFilter.startDate),
            $lte:new Date(dateRangeFilter.endDate)
    
            }
            dateFilter={
            createdAt:filter
            }
        }
      
        if (filterByDate === 'TODAY') {
            const filter = { $gte: currentDate, $lte: endOfDay };
            dateFilter = { createdAt: filter };
        }
    
        if (filterByDate === 'ALL') {
            dateFilter = {  };
        }
     const aggregate = [
        {
          $match: dateFilter
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $facet: {
            paginatedData: [
              {
                $skip: (currentPage - 1) * pageSize,
              },
              {
                $limit: pageSize,
              },
              {
                $project: {
                  createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  _id: 1,
                  orderNumber: 1,
                  tokenNumber: 1,
                  customerName: 1,
                  totalBill: 1,
                  orderItems:1,
                  paymentStatus: 1,
                }
              }
            ],
            salesTotal: [
              {
                $group: {
                  _id: null,
                  salesTotal: { $sum: "$totalBill" },
                }
              }
            ],
            totalItems: [
              {
                $count: "count",
              },
            ],
          }
        },
        {
          $project: {
            paginatedData: 1,
            salesTotal: 1,
            totalItems: 1,
          }
        },
        {
          $project: {
            paginatedData: 1,
            totalSale:{$arrayElemAt:["$salesTotal.salesTotal",0]},
            totalRecords: {$arrayElemAt:["$totalItems.count",0]}
          }
        }
      ];
      
      const queryResult= await OrderModel.aggregate(
        aggregate
        ).exec();
        
      
      if(queryResult){
        return res.status(200).json({data:{
          orders:queryResult[0].paginatedData,
          salesTotal:queryResult[0].totalSale,
          totalPages:Math.ceil(queryResult[0].totalRecords / pageSize),
          totalRecords:queryResult[0].totalRecords
        },
         message:"Sale Report Generated",
         success:true
        }   
        );
      }
      return res.status(200).json({
        data:{},
        message:"No Data found",
        success:false
    
    });
    }
    catch(ex){
        return res.status(200).json({data:{},message:`Exception:${ex}`,success:fillAndStroke});
    }
  
  }
  module.exports={
    getSaleReport
  }