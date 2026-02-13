const CategoryModel=require('../models/categoryModel');
const MenuModel=require('../models/menuModel');
// const User = require('../models/authModel');
// const bcrypt = require('bcryptjs');

const createDefaultCategoriesAndMenus = async () => {
  try {
    // -------------------------
    // Categories
    // -------------------------
    const categoriesData = [
      { name_en: 'Burgers', name_ar: 'برجر' },
      { name_en: 'Pizza', name_ar: 'بيتزا' },
      { name_en: 'Sandwiches', name_ar: 'سندويتشات' },
      { name_en: 'Grills', name_ar: 'مشويات' },
      { name_en: 'Rice Dishes', name_ar: 'أرز' },
      { name_en: 'Seafood', name_ar: 'مأكولات بحرية' },
      { name_en: 'Breakfast', name_ar: 'فطور' },
      { name_en: 'Desserts', name_ar: 'حلويات' },
      { name_en: 'Drinks', name_ar: 'مشروبات' },
    ];

    const categories = {};

    for (let i = 0; i < categoriesData.length; i++) {
      const data = categoriesData[i];

      let category = await CategoryModel.findOne({ name_en: data.name_en });

      if (!category) {
        category = await CategoryModel.create({
          ...data,
          description_en: `${data.name_en} category`,
          description_ar: `قسم ${data.name_ar}`,
          imageUrl: `https://picsum.photos/seed/category${i}/400/300`,
          priority_number: i + 1,
        });

        console.log(`✅ Category "${data.name_en}" created`);
      } else {
        console.log(`ℹ️ Category "${data.name_en}" already exists`);
      }

      categories[data.name_en] = category;
    }

    // -------------------------
    // Real KSA Menus
    // -------------------------
    const menus = [
      // Burgers
      { name_en: 'Beef Burger', name_ar: 'برجر لحم', category: 'Burgers', price: 22 },
      { name_en: 'Chicken Burger', name_ar: 'برجر دجاج', category: 'Burgers', price: 20 },
      { name_en: 'Spicy Burger', name_ar: 'برجر سبايسي', category: 'Burgers', price: 23 },

      // Pizza
      { name_en: 'Pepperoni Pizza', name_ar: 'بيتزا بيبروني', category: 'Pizza', price: 30 },
      { name_en: 'Chicken Pizza', name_ar: 'بيتزا دجاج', category: 'Pizza', price: 28 },
      { name_en: 'Vegetable Pizza', name_ar: 'بيتزا خضار', category: 'Pizza', price: 26 },

      // Sandwiches
      { name_en: 'Chicken Shawarma', name_ar: 'شاورما دجاج', category: 'Sandwiches', price: 10 },
      { name_en: 'Beef Shawarma', name_ar: 'شاورما لحم', category: 'Sandwiches', price: 12 },
      { name_en: 'Falafel Sandwich', name_ar: 'فلافل', category: 'Sandwiches', price: 8 },

      // Grills
      { name_en: 'Mixed Grill', name_ar: 'مشويات مشكلة', category: 'Grills', price: 45 },
      { name_en: 'Chicken Tikka', name_ar: 'دجاج تكا', category: 'Grills', price: 28 },
      { name_en: 'Beef Kebab', name_ar: 'كباب لحم', category: 'Grills', price: 32 },

      // Rice
      { name_en: 'Chicken Kabsa', name_ar: 'كبسة دجاج', category: 'Rice Dishes', price: 25 },
      { name_en: 'Mandi Lamb', name_ar: 'مندي لحم', category: 'Rice Dishes', price: 40 },
      { name_en: 'Biryani Chicken', name_ar: 'برياني دجاج', category: 'Rice Dishes', price: 24 },

      // Seafood
      { name_en: 'Fried Fish', name_ar: 'سمك مقلي', category: 'Seafood', price: 35 },
      { name_en: 'Grilled Shrimp', name_ar: 'روبيان مشوي', category: 'Seafood', price: 42 },

      // Breakfast
      { name_en: 'Foul & Tameez', name_ar: 'فول وتميس', category: 'Breakfast', price: 7 },
      { name_en: 'Shakshouka', name_ar: 'شكشوكة', category: 'Breakfast', price: 10 },
      { name_en: 'Egg Sandwich', name_ar: 'ساندويتش بيض', category: 'Breakfast', price: 6 },

      // Desserts
      { name_en: 'Kunafa', name_ar: 'كنافة', category: 'Desserts', price: 12 },
      { name_en: 'Basbousa', name_ar: 'بسبوسة', category: 'Desserts', price: 10 },
      { name_en: 'Luqaimat', name_ar: 'لقيمات', category: 'Desserts', price: 9 },

      // Drinks
      { name_en: 'Saudi Coffee', name_ar: 'قهوة سعودية', category: 'Drinks', price: 5 },
      { name_en: 'Karak Tea', name_ar: 'شاي كرك', category: 'Drinks', price: 4 },
      { name_en: 'Fresh Orange Juice', name_ar: 'عصير برتقال طازج', category: 'Drinks', price: 8 },
    ];

    let createdCount = 0;

    for (const item of menus) {
      const exists = await MenuModel.findOne({ name_en: item.name_en });
      if (exists) continue;

      await MenuModel.create({
        name_en: item.name_en,
        name_ar: item.name_ar,
        category: categories[item.category]._id,
        unitPrice: item.price,
        imageUrl: `https://picsum.photos/seed/${item.name_en.replace(/\s/g, '')}/400/300`,
        availability: true,
      });

      createdCount++;
    }

    console.log(`🎉 Seed completed: ${Object.keys(categories).length} categories, ${createdCount} menus`);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
};


  module.exports=createDefaultCategoriesAndMenus;