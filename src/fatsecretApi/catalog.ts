// Documentation snapshot: https://platform.fatsecret.com/docs/guides (2026-10-26).
// Dates are explicit ISO inputs; food_entries.get accepts date OR entry ID.
// Credential-issuing profile.create/profile.get_auth stay outside the chat tool surface.
import type { ApiMethod } from './types.js';

export const apiMethods: ApiMethod[] = [
  {
    "name": "foods.autocomplete",
    "source": "https://platform.fatsecret.com/docs/v2/foods.autocomplete",
    "title": "Foods: Autocomplete Search",
    "description": "Returns food elements best matching the search expression specified, ordered by their relevancy to the search expression.",
    "endpoint": "https://platform.fatsecret.com/rest/food/autocomplete/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": false,
    "premier": true,
    "parameters": [
      [
        "expression",
        "String",
        true,
        "Suggestions for the given expression is returned. E.G.: \"chic\" will return up to four of the best suggestions that contains \"chic\""
      ],
      [
        "max_results",
        "Int",
        false,
        "Maximum number of results to return (default value is 4). This number cannot be greater than 10"
      ],
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ]
    ],
    "apiMethod": "foods.autocomplete.v2"
  },
  {
    "name": "foods.search",
    "source": "https://platform.fatsecret.com/docs/v5/foods.search",
    "title": "Foods: Search",
    "description": "Conducts a search of the food database using the search expression specified. The results are paginated according to a zero-based \"page\" offset. Successive pages of results may be retrieved by specifying a starting page offset value. For instance, specifying a max_results of 10 and page_number of 4 will return results numbered 41-50. Returns detailed nutritional information for the specified food. Use this call to display nutrition values for a food to users.",
    "endpoint": "https://platform.fatsecret.com/rest/foods/search/v5",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": false,
    "premier": true,
    "parameters": [
      [
        "search_expression",
        "String",
        false,
        "Search expression to match on food names"
      ],
      [
        "page_number",
        "Int",
        false,
        "Zero-based offset into the results for the query"
      ],
      [
        "max_results",
        "Int",
        false,
        "Maximum number of results to return (default value is 20). This number cannot be greater than 50"
      ],
      [
        "include_sub_categories",
        "Boolean",
        false,
        "Response will include the names of all sub categories associated with the food"
      ],
      [
        "include_food_images",
        "Boolean",
        false,
        "Response will include food image in the response. (Requires separate premier offering, please contact us in order for this feature to be enabled for your account)"
      ],
      [
        "include_food_attributes",
        "Boolean",
        false,
        "Response will include food dietary preferences and allergens if available. (Requires separate premier offering, please contact us in order for this feature to be enabled for your account)"
      ],
      [
        "flag_default_serving",
        "Boolean",
        false,
        "Either \"true\" or \"false\" - the response will flag one of the servings as the default serving (the suggested or most commonly chosen option)"
      ],
      [
        "food_type",
        "String",
        false,
        "Restricts search results to a specific type. Valid values are \"none\", \"generic\" or \"brand\". Defaults to \"none\" i.e no filter"
      ],
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ],
      [
        "language",
        "String",
        false,
        "(Ignored unless region is also specified) Results will be in the specified language. E.G.: \"fr\" returns results in French"
      ]
    ],
    "apiMethod": "foods.search.v5"
  },
  {
    "name": "food.find_id_for_barcode",
    "source": "https://platform.fatsecret.com/docs/v2/food.find_id_for_barcode",
    "title": "Foods: Find Id For Barcode",
    "description": "Returns detailed nutritional information for the specified food matching the barcode specified. Barcodes must be specified as GTIN-13 numbers - a 13-digit number filled in with zeros for the spaces to the left. UPC-A, EAN-13 and EAN-8 barcodes may be specified. UPC-E barcodes should be converted to their UPC-A equivalent (and then specified as GTIN-13 numbers).",
    "endpoint": "https://platform.fatsecret.com/rest/food/barcode/find-by-id/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": false,
    "premier": true,
    "parameters": [
      [
        "barcode",
        "String",
        true,
        "13-digit GTIN-13 formatted sequence of digits representing the barcode to search against"
      ],
      [
        "include_sub_categories",
        "Boolean",
        false,
        "Response will include the names of all sub categories associated with the food"
      ],
      [
        "include_food_images",
        "Boolean",
        false,
        "Response will include food image in the response. (Requires separate premier offering, please contact us in order for this feature to be enabled for your account)"
      ],
      [
        "include_food_attributes",
        "Boolean",
        false,
        "Response will include food dietary preferences and allergens if available. (Requires separate premier offering, please contact us in order for this feature to be enabled for your account)"
      ],
      [
        "flag_default_serving",
        "Boolean",
        false,
        "Either \"true\" or \"false\" - the response will flag one of the servings as the default serving (the suggested or most commonly chosen option)"
      ],
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ],
      [
        "language",
        "String",
        false,
        "(Ignored unless region is also specified) Results will be in the specified language. E.G.: \"fr\" returns results in French"
      ]
    ],
    "apiMethod": "food.find_id_for_barcode.v2"
  },
  {
    "name": "natural.language.processing",
    "source": "https://platform.fatsecret.com/docs/v1/natural.language.processing",
    "title": "Natural Language Processing",
    "description": "Match a free-text food description to database foods and servings. This does not add food diary entries.",
    "endpoint": "https://platform.fatsecret.com/rest/natural-language-processing/v1",
    "httpMethod": "POST",
    "encoding": "json",
    "write": false,
    "delegated": false,
    "premier": true,
    "parameters": [
      [
        "user_input",
        "String",
        true,
        "A description of what a user has eaten. May contain multiple items. e.g. \"A toast with ham and cheese, an apple, a banana and a cappuccino\". This field is limited to 1000 characters"
      ],
      [
        "include_food_data",
        "Bool",
        false,
        "Include full food data in the response (see our food.get API)"
      ],
      [
        "eaten_foods",
        "Array",
        false,
        "An array of previously consumed foods. This may be provided to assist with more accurate matching of foods identified in the input with previously consumed foods"
      ],
      [
        "eaten_foods.food_id",
        "Long",
        true,
        "The ID of the food that has been previously consumed"
      ],
      [
        "eaten_foods.food_name",
        "String",
        true,
        "The name of the food that has been previously consumed"
      ],
      [
        "eaten_foods.food_brand",
        "String",
        false,
        "The brand name of the food that has been previously consumed"
      ],
      [
        "eaten_foods.serving_description",
        "String",
        false,
        "The serving description of the food that has been previously consumed"
      ],
      [
        "eaten_foods.serving_size",
        "String",
        false,
        "The serving size of the food that has been previously consumed"
      ],
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ],
      [
        "language",
        "String",
        false,
        "(Ignored unless region is also specified) Results will be in the specified language. E.G.: \"fr\" returns results in French"
      ]
    ],
    "apiMethod": null
  },
  {
    "name": "image.recognition",
    "source": "https://platform.fatsecret.com/docs/v2/image.recognition",
    "title": "Image Recognition",
    "description": "Identify foods and estimate portions from a base64 JPEG, PNG or WebP image. This does not add food diary entries.",
    "endpoint": "https://platform.fatsecret.com/rest/image-recognition/v2",
    "httpMethod": "POST",
    "encoding": "json",
    "write": false,
    "delegated": false,
    "premier": true,
    "parameters": [
      [
        "image_b64",
        "String",
        true,
        "A Base64 image of one or more foods. This field is limited to 999,982 characters"
      ],
      [
        "include_food_data",
        "Bool",
        false,
        "Include full food data in the response (see our food.get API)"
      ],
      [
        "eaten_foods",
        "Array",
        false,
        "An array of previously consumed foods. This may be provided to assist with more accurate matching of foods identified in the input with previously consumed foods"
      ],
      [
        "eaten_foods.food_id",
        "Long",
        true,
        "The ID of the food that has been previously consumed"
      ],
      [
        "eaten_foods.food_name",
        "String",
        true,
        "The name of the food that has been previously consumed"
      ],
      [
        "eaten_foods.food_brand",
        "String",
        false,
        "The brand name of the food that has been previously consumed"
      ],
      [
        "eaten_foods.serving_description",
        "String",
        false,
        "The serving description of the food that has been previously consumed"
      ],
      [
        "eaten_foods.serving_size",
        "String",
        false,
        "The serving size of the food that has been previously consumed"
      ],
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ],
      [
        "language",
        "String",
        false,
        "(Ignored unless region is also specified) Results will be in the specified language. E.G.: \"fr\" returns results in French"
      ]
    ],
    "apiMethod": null
  },
  {
    "name": "food.get",
    "source": "https://platform.fatsecret.com/docs/v5/food.get",
    "title": "Foods: Get By Id",
    "description": "Returns detailed nutritional information for the specified food for each available standard serving size. Use this call to display nutrition values for a food to users.",
    "endpoint": "https://platform.fatsecret.com/rest/food/v5",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": false,
    "premier": false,
    "parameters": [
      [
        "food_id",
        "Long",
        true,
        "Unique food identifier"
      ],
      [
        "include_sub_categories",
        "Boolean",
        false,
        "Response will include the names of all sub categories associated with the food"
      ],
      [
        "include_food_images",
        "Boolean",
        false,
        "Response will include food image in the response. (Requires separate premier offering, please contact us in order for this feature to be enabled for your account)"
      ],
      [
        "include_food_attributes",
        "Boolean",
        false,
        "Response will include food dietary preferences and allergens if available. (Requires separate premier offering, please contact us in order for this feature to be enabled for your account)"
      ],
      [
        "flag_default_serving",
        "Boolean",
        false,
        "Either \"true\" or \"false\" - the response will flag one of the servings as the default serving (the suggested or most commonly chosen option)"
      ],
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ],
      [
        "language",
        "String",
        false,
        "(Ignored unless region is also specified) Results will be in the specified language. E.G.: \"fr\" returns results in French"
      ]
    ],
    "apiMethod": "food.get.v5"
  },
  {
    "name": "foods.search",
    "source": "https://platform.fatsecret.com/docs/v1/foods.search",
    "title": "Foods: Search",
    "description": "Conducts a search of the food database using the search expression specified. The results are paginated according to a zero-based \"page\" offset. Successive pages of results may be retrieved by specifying a starting page offset value. For instance, specifying a max_results of 10 and page_number of 4 will return results numbered 41-50. Search results will be refined according to the user's prior saved food entries.",
    "endpoint": "https://platform.fatsecret.com/rest/foods/search/v1",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": false,
    "premier": false,
    "parameters": [
      [
        "search_expression",
        "String",
        false,
        "Search expression to match on food names"
      ],
      [
        "page_number",
        "Int",
        false,
        "Zero-based offset into the results for the query"
      ],
      [
        "max_results",
        "Int",
        false,
        "Maximum number of results to return (default value is 20). This number cannot be greater than 50"
      ],
      [
        "generic_description",
        "String",
        false,
        "Either \"weight\" or \"portion\": Weight (default) - the summary description for key nutritional values is displayed by weight (typically 100g); E.G.: \"Per 100g\". Portion - the summary description for key nutritional values is displayed using the default portion size; E.G.: \"Per 1 Cup\"\nNote that the summary nutrition description for \"Brand\" food items is always shown using a \"portion\" based description"
      ],
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ],
      [
        "language",
        "String",
        false,
        "(Ignored unless region is also specified) Results will be in the specified language. E.G.: \"fr\" returns results in French"
      ]
    ],
    "apiMethod": "foods.search"
  },
  {
    "name": "feedback",
    "source": "https://platform.fatsecret.com/docs/v1/feedback",
    "title": "Feedback",
    "description": "Submit feedback about incorrect or missing food/barcode information to FatSecret. Returns optional signed URLs for supporting image uploads.",
    "endpoint": "https://platform.fatsecret.com/rest/feedback/v1",
    "httpMethod": "POST",
    "encoding": "json",
    "write": true,
    "delegated": false,
    "premier": true,
    "parameters": [
      [
        "barcode",
        "String",
        false,
        "A barcode where a food is associated incorrectly. Required when issue_type_id is 1"
      ],
      [
        "issue_type_id",
        "Int",
        true,
        "The type ID for the request. Valid options are 1 (Wrong Name/Brand), 2 (Wrong Nutrition Info), 3 (Missing Serving Size), 4 (Barcode not found), 99 (Other)"
      ],
      [
        "issue_type",
        "String",
        false,
        "Issue description. This is to be provided when the issue_type_id is 99 (Other)"
      ],
      [
        "notes",
        "String",
        false,
        "Custom notes regarding the issue"
      ],
      [
        "external_id",
        "String",
        true,
        "Custom identifier for external use. E.g an external unique user identifier"
      ],
      [
        "returned_food.food_id",
        "Int",
        false,
        "A food ID that is related to the issue (i.e. barcode incorrect food attached). Required when issue_type_id is 1, 2 or 3"
      ],
      [
        "returned_food.serving_id",
        "Int",
        false,
        "A foods serving ID that is related to the issue (i.e. incorrect nutrient information). Required when issue_type_id is 2 or 3"
      ],
      [
        "image_file_extension",
        "String",
        false,
        "The image file extension in which the signed uploads will be generated using. Accepts jpg, jpeg, png and tiff. Defaulted to jpg if not provided"
      ],
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ],
      [
        "language",
        "String",
        false,
        "(Ignored unless region is also specified) Results will be in the specified language. E.G.: \"fr\" returns results in French"
      ]
    ],
    "apiMethod": null
  },
  {
    "name": "food_brands.get",
    "source": "https://platform.fatsecret.com/docs/v2/food_brands.get",
    "title": "Food Brands: Get All",
    "description": "This is a utility method, returning the list of food brands.",
    "endpoint": "https://platform.fatsecret.com/rest/brands/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": false,
    "premier": true,
    "parameters": [
      [
        "starts_with",
        "String",
        false,
        "Food brands that begin with the first letter is returned. The \"*\" will return all food brands beginning with a numeric character. If this is not specified then the most popular food brands at the time is returned"
      ],
      [
        "brand_type",
        "String",
        false,
        "Either \"manufacturer\", \"restaurant\" or \"supermarket\" (default value is \"manufacturer\")"
      ],
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ],
      [
        "language",
        "String",
        false,
        "(Ignored unless region is also specified) Results will be in the specified language. E.G.: \"fr\" returns results in French"
      ]
    ],
    "apiMethod": "food_brands.get.v2"
  },
  {
    "name": "food_categories.get",
    "source": "https://platform.fatsecret.com/docs/v2/food_categories.get",
    "title": "Food Categories: Get All",
    "description": "This is a utility method, returning the full list of all food categories and their associated unique identifiers.",
    "endpoint": "https://platform.fatsecret.com/rest/food-categories/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": false,
    "premier": true,
    "parameters": [
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ],
      [
        "language",
        "String",
        false,
        "(Ignored unless region is also specified) Results will be in the specified language. E.G.: \"fr\" returns results in French"
      ]
    ],
    "apiMethod": "food_categories.get.v2"
  },
  {
    "name": "food_sub_categories.get",
    "source": "https://platform.fatsecret.com/docs/v2/food_sub_categories.get",
    "title": "Food Sub Categories: Get All",
    "description": "This is a utility method, returning the full list of all food sub categories for a food category.",
    "endpoint": "https://platform.fatsecret.com/rest/food-sub-categories/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": false,
    "premier": true,
    "parameters": [
      [
        "food_category_id",
        "Long",
        true,
        "Unique identifier of the food category entry"
      ],
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ],
      [
        "language",
        "String",
        false,
        "(Ignored unless region is also specified) Results will be in the specified language. E.G.: \"fr\" returns results in French"
      ]
    ],
    "apiMethod": "food_sub_categories.get.v2"
  },
  {
    "name": "recipe.get",
    "source": "https://platform.fatsecret.com/docs/v2/recipe.get",
    "title": "Recipes: Get By Id",
    "description": "Returns detailed information for the specified recipe for the standard serving.",
    "endpoint": "https://platform.fatsecret.com/rest/recipe/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": false,
    "premier": false,
    "parameters": [
      [
        "recipe_id",
        "Long",
        true,
        "Unique recipe identifier"
      ],
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ]
    ],
    "apiMethod": "recipe.get.v2"
  },
  {
    "name": "recipes.search",
    "source": "https://platform.fatsecret.com/docs/v3/recipes.search",
    "title": "Recipes: Search",
    "description": "Conducts a search of the recipe database using the search expression specified. The results are paginated according to a zero-based \"page\" offset. Successive pages of results may be retrieved by specifying a starting page offset value. For instance, specifying a max_results of 10 and page_number of 4 will return results numbered 41-50.",
    "endpoint": "https://platform.fatsecret.com/rest/recipes/search/v3",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": false,
    "premier": false,
    "parameters": [
      [
        "recipe_types",
        "String",
        false,
        "This option filters by specified recipe types and should be provided as a comma separated string of recipe type names. The values are provided via the api: Recipe Types Get All"
      ],
      [
        "recipe_types_matchall",
        "Bool",
        false,
        "This option will affect recipe type filters. If true, a recipe must match all provided recipe types, if false (default) then recipes matching any of the supplied types will be returned, The values are provided via the api: Recipe Types Get All"
      ],
      [
        "search_expression",
        "String",
        false,
        "Search expression to match on food names"
      ],
      [
        "must_have_images",
        "Bool",
        false,
        "This option will restrict results to recipes with at least one image"
      ],
      [
        "calories.from",
        "Long",
        false,
        "Minimum calories that are contained in the recipe"
      ],
      [
        "calories.to",
        "Long",
        false,
        "Maximum calories that are contained in the recipe"
      ],
      [
        "carb_percentage.from",
        "Long",
        false,
        "Minimum percentage of the calories composed of carbohydrate"
      ],
      [
        "carb_percentage.to",
        "Long",
        false,
        "Maximum percentage of the calories composed of carbohydrate"
      ],
      [
        "protein_percentage.from",
        "Long",
        false,
        "Minimum percentage of the calories composed of protein"
      ],
      [
        "protein_percentage.to",
        "Long",
        false,
        "Maximum percentage of the calories composed of protein"
      ],
      [
        "fat_percentage.from",
        "Long",
        false,
        "Minimum percentage of the calories composed of fat"
      ],
      [
        "fat_percentage.to",
        "Long",
        false,
        "Maximum percentage of the calories composed of fat"
      ],
      [
        "prep_time.from",
        "Long",
        false,
        "Minimum preparation and cook time in minutes required to create the recipe"
      ],
      [
        "prep_time.to",
        "Long",
        false,
        "Maximum preparation and cook time in minutes required to create the recipe"
      ],
      [
        "page_number",
        "Int",
        false,
        "Zero-based offset into the results for the query"
      ],
      [
        "max_results",
        "Int",
        false,
        "Maximum number of results to return (default value is 20). This number cannot be greater than 50"
      ],
      [
        "sort_by",
        "String",
        false,
        "This option will order results. Valid options include: newest, oldest, caloriesPerServingAscending, caloriesPerServingDescending. When not explicitly set, the ordering will be returned by newest"
      ],
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ]
    ],
    "apiMethod": "recipes.search.v3"
  },
  {
    "name": "recipe_types.get",
    "source": "https://platform.fatsecret.com/docs/v2/recipe_types.get",
    "title": "Recipe Types: Get All",
    "description": "This is a utility method, returning the full list of all supported recipe type names.",
    "endpoint": "https://platform.fatsecret.com/rest/recipe-types/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": false,
    "premier": false,
    "parameters": [
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ],
      [
        "language",
        "String",
        false,
        "(Ignored unless region is also specified) Results will be in the specified language. E.G.: \"fr\" returns results in French"
      ]
    ],
    "apiMethod": "recipe_types.get.v2"
  },
  {
    "name": "food.create",
    "source": "https://platform.fatsecret.com/docs/v2/food.create",
    "title": "Profile - Foods: Create",
    "description": "Creates a food for the user according to the parameters specified. The result of the call is the new unique identifier of the newly created food. Updates to food labels On May 27, 2016 the USA Food and Drug Administration (FDA) published new rules on the new Nutrition Facts label for packaged foods to reflect new scientific information, including the link between diet and chronic diseases such as obesity and heart disease. Manufacturers in the USA with $10 million or more in annual sales were required to switch to the new label by January 1, 2020; manufacturers with less than $10 million in annual food sales have until January 1, 2021 to comply. More information can be found here: Changes to the Nutrition Facts Label Please find more information on how to calculate the %DV for your users: Dietary Supplement Label Database What are the differences between food.create and food.create.v2? food.create food.create.v2 The Vitamin A value is the percentage of daily recommended. It is based on a 2000 calorie diet. The Vitamin A value is the raw value in micrograms (mcg). It is up to the developer to calculate the %DV (Percent Daily Value) The Vitamin C value is the percentage of daily reco",
    "endpoint": "https://platform.fatsecret.com/rest/food/v2",
    "httpMethod": "POST",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": true,
    "parameters": [
      [
        "brand_type",
        "String",
        true,
        "Either \"manufacturer\", \"restaurant\" or \"supermarket\" (default value is \"manufacturer\")"
      ],
      [
        "brand_name",
        "String",
        true,
        "Brand name, only when food_type is \"Brand\". E.G.: \"Quaker\""
      ],
      [
        "food_name",
        "String",
        true,
        "Name of the food, not including the brand name. E.G.: \"Instant Oatmeal\""
      ],
      [
        "serving_size",
        "String",
        true,
        "Full description of the serving size. E.G.: \"1 serving\""
      ],
      [
        "calories",
        "Decimal",
        true,
        "Energy content in kcal"
      ],
      [
        "fat",
        "Decimal",
        true,
        "Total fat content in grams"
      ],
      [
        "carbohydrate",
        "Decimal",
        true,
        "Total carbohydrate content in grams"
      ],
      [
        "protein",
        "Decimal",
        true,
        "Protein content in grams"
      ],
      [
        "serving_amount",
        "String",
        false,
        "The quantity combined with serving_amount_unit to derive the total standardized quantity of the serving"
      ],
      [
        "serving_amount_unit",
        "String",
        false,
        "The metric unit of measure for the serving size – either \"g\" or \"ml\" or \"oz\" – combined with metric_serving_amount to derive the total standardized quantity of the serving (default value is \"g\")"
      ],
      [
        "calories_from_fat",
        "Decimal",
        false,
        "The energy content in kcal from fat"
      ],
      [
        "saturated_fat",
        "Decimal",
        false,
        "Saturated fat content in grams (where available)"
      ],
      [
        "polyunsaturated_fat",
        "Decimal",
        false,
        "Polyunsaturated fat content in grams (where available)"
      ],
      [
        "monounsaturated_fat",
        "Decimal",
        false,
        "Monounsaturated fat content in grams (where available)"
      ],
      [
        "trans_fat",
        "Decimal",
        false,
        "Trans fat content in grams (where available)"
      ],
      [
        "cholesterol",
        "Decimal",
        false,
        "Cholesterol content in milligrams (where available)"
      ],
      [
        "sodium",
        "Decimal",
        false,
        "Sodium content in milligrams (where available)"
      ],
      [
        "potassium",
        "Decimal",
        false,
        "Potassium content in milligrams (where available)"
      ],
      [
        "fiber",
        "Decimal",
        false,
        "Fiber content in grams (where available)"
      ],
      [
        "sugar",
        "Decimal",
        false,
        "Sugar content in grams (where available)"
      ],
      [
        "added_sugars",
        "Decimal",
        false,
        "Added Sugars content in grams (where available)"
      ],
      [
        "vitamin_d",
        "Decimal",
        false,
        "Vitamin D content in micrograms (where available)"
      ],
      [
        "vitamin_a",
        "Decimal",
        false,
        "Vitamin A content in micrograms (where available)"
      ],
      [
        "vitamin_c",
        "Decimal",
        false,
        "Vitamin C content in milligrams (where available)"
      ],
      [
        "calcium",
        "Decimal",
        false,
        "Calcium content in milligrams (where available)"
      ],
      [
        "iron",
        "Decimal",
        false,
        "Iron content in milligrams (where available)"
      ],
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ],
      [
        "language",
        "String",
        false,
        "(Ignored unless region is also specified) Results will be in the specified language. E.G.: \"fr\" returns results in French"
      ]
    ],
    "apiMethod": "food.create.v2"
  },
  {
    "name": "food.add_favorite",
    "source": "https://platform.fatsecret.com/docs/v1/food.add_favorite",
    "title": "Profile - Foods: Add Favorite",
    "description": "Add a food to a user's favorite according to the parameters specified.",
    "endpoint": "https://platform.fatsecret.com/rest/food/favorite/v1",
    "httpMethod": "POST",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "food_id",
        "Long",
        true,
        "Unique food identifier"
      ],
      [
        "serving_id",
        "Long",
        false,
        "Unique serving identifier"
      ],
      [
        "number_of_units",
        "Decimal",
        false,
        "Number of units in this standard serving size. For instance, if the serving description is \"2 tablespoons\" the number of units is \"2\", while if the serving size is \"1 cup\" the number of units is \"1\". Please note that this is only applicable for when food_type is \"Generic\" whereas for \"Brand\" the number of units will always be \"1\""
      ]
    ],
    "apiMethod": "food.add_favorite"
  },
  {
    "name": "food.delete_favorite",
    "source": "https://platform.fatsecret.com/docs/v1/food.delete_favorite",
    "title": "Profile - Foods: Delete Favorite",
    "description": "Deletes the specified food from the user's favorite.",
    "endpoint": "https://platform.fatsecret.com/rest/food/favorite/v1",
    "httpMethod": "DELETE",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "food_id",
        "Long",
        true,
        "Unique food identifier"
      ],
      [
        "serving_id",
        "Long",
        false,
        "Unique serving identifier"
      ],
      [
        "number_of_units",
        "Decimal",
        false,
        "Number of units in this standard serving size. For instance, if the serving description is \"2 tablespoons\" the number of units is \"2\", while if the serving size is \"1 cup\" the number of units is \"1\". Please note that this is only applicable for when food_type is \"Generic\" whereas for \"Brand\" the number of units will always be \"1\""
      ]
    ],
    "apiMethod": "food.delete_favorite"
  },
  {
    "name": "foods.get_favorites",
    "source": "https://platform.fatsecret.com/docs/v2/foods.get_favorites",
    "title": "Profile - Foods: Get All Favorites",
    "description": "Returns the favorite foods for the specified user.",
    "endpoint": "https://platform.fatsecret.com/rest/food/favorites/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": true,
    "premier": false,
    "parameters": [],
    "apiMethod": "foods.get_favorites.v2"
  },
  {
    "name": "foods.get_most_eaten",
    "source": "https://platform.fatsecret.com/docs/v2/foods.get_most_eaten",
    "title": "Profile - Foods: Get Most Eaten",
    "description": "Returns the favorite foods for the specified user.",
    "endpoint": "https://platform.fatsecret.com/rest/food/most-eaten/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "meal",
        "String",
        false,
        "Type of meal eaten. Valid meal types are \"breakfast\", \"lunch\", \"dinner\" and \"other\""
      ]
    ],
    "apiMethod": "foods.get_most_eaten.v2"
  },
  {
    "name": "foods.get_recently_eaten",
    "source": "https://platform.fatsecret.com/docs/v2/foods.get_recently_eaten",
    "title": "Profile - Foods: Get Recently Eaten",
    "description": "Returns the favorite foods for the specified user.",
    "endpoint": "https://platform.fatsecret.com/rest/food/recently-eaten/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "meal",
        "String",
        false,
        "Type of meal eaten. Valid meal types are \"breakfast\", \"lunch\", \"dinner\" and \"other\""
      ]
    ],
    "apiMethod": "foods.get_recently_eaten.v2"
  },
  {
    "name": "recipe.add_favorite",
    "source": "https://platform.fatsecret.com/docs/v1/recipe.add_favorite",
    "title": "Profile - Recipes: Add Favorite",
    "description": "Add a recipe to a user's favorite.",
    "endpoint": "https://platform.fatsecret.com/rest/recipe/favorites/v1",
    "httpMethod": "POST",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "recipe_id",
        "Long",
        true,
        "Unique recipe identifier"
      ]
    ],
    "apiMethod": "recipe.add_favorite"
  },
  {
    "name": "recipe.delete_favorite",
    "source": "https://platform.fatsecret.com/docs/v1/recipe.delete_favorite",
    "title": "Profile - Recipes: Delete Favorite",
    "description": "Deletes the specified recipe from the user's favorite.",
    "endpoint": "https://platform.fatsecret.com/rest/recipe/favorites/v1",
    "httpMethod": "DELETE",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "recipe_id",
        "Long",
        true,
        "Unique recipe identifier"
      ]
    ],
    "apiMethod": "recipe.delete_favorite"
  },
  {
    "name": "recipes.get_favorites",
    "source": "https://platform.fatsecret.com/docs/v2/recipes.get_favorites",
    "title": "Profile - Recipes: Get All Favorites",
    "description": "Returns the favorite recipes for the specified user.",
    "endpoint": "https://platform.fatsecret.com/rest/recipe/favorites/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": true,
    "premier": false,
    "parameters": [],
    "apiMethod": "recipe.get_favorites.v2"
  },
  {
    "name": "saved_meal.create",
    "source": "https://platform.fatsecret.com/docs/v1/saved_meal.create",
    "title": "Profile - Saved Meals: Create Meal",
    "description": "Records a saved meal for the user according to the parameters specified. The result of the call is the new unique identifier of the newly created saved meal.",
    "endpoint": "https://platform.fatsecret.com/rest/saved-meals/v1",
    "httpMethod": "POST",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "saved_meal_name",
        "String",
        true,
        "New name of the saved meal"
      ],
      [
        "saved_meal_description",
        "String",
        false,
        "New description of the saved meal"
      ],
      [
        "meals",
        "String",
        false,
        "Comma separated list of meals the saved meal is suitable for"
      ]
    ],
    "apiMethod": "saved_meal.create"
  },
  {
    "name": "saved_meal.delete",
    "source": "https://platform.fatsecret.com/docs/v1/saved_meal.delete",
    "title": "Profile - Saved Meals: Delete Meal By Id",
    "description": "Deletes the specified saved meal for the user.",
    "endpoint": "https://platform.fatsecret.com/rest/saved-meals/v1",
    "httpMethod": "DELETE",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "saved_meal_id",
        "Long",
        true,
        "Unique saved meal identifier"
      ]
    ],
    "apiMethod": "saved_meal.delete"
  },
  {
    "name": "saved_meal.edit",
    "source": "https://platform.fatsecret.com/docs/v1/saved_meal.edit",
    "title": "Profile - Saved Meals: Edit Meal By Id",
    "description": "Records a change to a user's saved meal.",
    "endpoint": "https://platform.fatsecret.com/rest/saved-meals/v1",
    "httpMethod": "PUT",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "saved_meal_id",
        "Long",
        true,
        "Unique saved meal identifier"
      ],
      [
        "saved_meal_name",
        "String",
        false,
        "New name of the saved meal"
      ],
      [
        "saved_meal_description",
        "String",
        false,
        "New description of the saved meal"
      ],
      [
        "meals",
        "String",
        false,
        "Comma separated list of meals the saved meal is suitable for"
      ]
    ],
    "apiMethod": "saved_meal.edit"
  },
  {
    "name": "saved_meals.get",
    "source": "https://platform.fatsecret.com/docs/v2/saved_meals.get",
    "title": "Profile - Saved Meals: Get All Meals",
    "description": "Returns saved meals for the specified user.",
    "endpoint": "https://platform.fatsecret.com/rest/saved-meals/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "meal",
        "String",
        false,
        "Type of meal eaten. Valid meal types are \"breakfast\", \"lunch\", \"dinner\" and \"other\""
      ]
    ],
    "apiMethod": "saved_meals.get.v2"
  },
  {
    "name": "saved_meal_item.add",
    "source": "https://platform.fatsecret.com/docs/v1/saved_meal_item.add",
    "title": "Profile - Saved Meals: Add Food To Meal",
    "description": "Adds a food to a user's saved meal according to the parameters specified. The result of the call is the new unique identifier of the newly created saved meal item.",
    "endpoint": "https://platform.fatsecret.com/rest/saved-meals/item/v1",
    "httpMethod": "POST",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "saved_meal_id",
        "Long",
        true,
        "Unique saved meal identifier"
      ],
      [
        "food_id",
        "Long",
        true,
        "Unique food identifier"
      ],
      [
        "saved_meal_item_name",
        "String",
        true,
        "New name of the saved meal item"
      ],
      [
        "serving_id",
        "Long",
        true,
        "Unique serving identifier"
      ],
      [
        "number_of_units",
        "Decimal",
        true,
        "Number of units in this standard serving size. For instance, if the serving description is \"2 tablespoons\" the number of units is \"2\", while if the serving size is \"1 cup\" the number of units is \"1\". Please note that this is only applicable for when food_type is \"Generic\" whereas for \"Brand\" the number of units will always be \"1\""
      ]
    ],
    "apiMethod": "saved_meal_item.add"
  },
  {
    "name": "saved_meal_item.edit",
    "source": "https://platform.fatsecret.com/docs/v1/saved_meal_item.edit",
    "title": "Profile - Saved Meals: Edit Food In Meal",
    "description": "Records a change to a user's saved meal item. Note that the serving_id of the saved meal item may not be adjusted, however one or more of the other remaining properties – saved_meal_item_name or number_of_units may be altered. In order to adjust a serving_id for which a saved_meal_item was recorded the original item must be deleted and a new item recorded.",
    "endpoint": "https://platform.fatsecret.com/rest/saved-meals/item/v1",
    "httpMethod": "PUT",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "saved_meal_item_id",
        "Long",
        true,
        "Unique saved meal item identifier"
      ],
      [
        "saved_meal_item_name",
        "String",
        false,
        "New name of the saved meal item"
      ],
      [
        "number_of_units",
        "Decimal",
        false,
        "Number of units in this standard serving size. For instance, if the serving description is \"2 tablespoons\" the number of units is \"2\", while if the serving size is \"1 cup\" the number of units is \"1\". Please note that this is only applicable for when food_type is \"Generic\" whereas for \"Brand\" the number of units will always be \"1\""
      ]
    ],
    "apiMethod": "saved_meal_item.edit"
  },
  {
    "name": "saved_meal_item.delete",
    "source": "https://platform.fatsecret.com/docs/v1/saved_meal_item.delete",
    "title": "Profile - Saved Meals: Delete Food From Meal",
    "description": "Deletes the specified saved meal item for the user.",
    "endpoint": "https://platform.fatsecret.com/rest/saved-meals/item/v1",
    "httpMethod": "DELETE",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "saved_meal_item_id",
        "Long",
        true,
        "Unique saved meal item identifier"
      ]
    ],
    "apiMethod": "saved_meal_item.delete"
  },
  {
    "name": "saved_meal_items.get",
    "source": "https://platform.fatsecret.com/docs/v2/saved_meal_items.get",
    "title": "Profile - Saved Meals: Get All Foods In Meal",
    "description": "Returns saved meal items for a specified saved meal.",
    "endpoint": "https://platform.fatsecret.com/rest/saved-meals/item/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "saved_meal_id",
        "Long",
        true,
        "Unique saved meal identifier"
      ]
    ],
    "apiMethod": "saved_meal_items.get.v2"
  },
  {
    "name": "profile.get",
    "source": "https://platform.fatsecret.com/docs/v1/profile.get",
    "title": "Profile - Authentication: Get Profile Status",
    "description": "Returns general status information for a nominated user.",
    "endpoint": "https://platform.fatsecret.com/rest/profile/v1",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": true,
    "premier": false,
    "parameters": [],
    "apiMethod": "profile.get"
  },
  {
    "name": "food_entries.copy",
    "source": "https://platform.fatsecret.com/docs/v1/food_entries.copy",
    "title": "Profile - Food Diary: Copy Entries Between Dates",
    "description": "Copies the food entries for a specified meal from a nominated date to a nominated date.",
    "endpoint": "https://platform.fatsecret.com/rest/food-entries/copy/v1",
    "httpMethod": "POST",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "from_date",
        "Int",
        true,
        "Date to copy food entries from expressed in the number of days since January 1, 1970"
      ],
      [
        "to_date",
        "Int",
        true,
        "Date to copy food entries to expressed in the number of days since January 1, 1970 (default value is the current day)"
      ],
      [
        "meal",
        "String",
        false,
        "Type of meal eaten. Valid meal types are \"breakfast\", \"lunch\", \"dinner\" and \"other\""
      ]
    ],
    "apiMethod": "food_entries.copy"
  },
  {
    "name": "food_entries.copy_saved_meal",
    "source": "https://platform.fatsecret.com/docs/v1/food_entries.copy_saved_meal",
    "title": "Profile - Food Diary: Copy Entries Between Meals",
    "description": "Copies the food entries for a specified saved meal to a specified meal.",
    "endpoint": "https://platform.fatsecret.com/rest/food-entries/copy/saved-meal/v1",
    "httpMethod": "POST",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "saved_meal_id",
        "Long",
        true,
        "Unique saved meal identifier"
      ],
      [
        "meal",
        "String",
        true,
        "Type of meal eaten. Valid meal types are \"breakfast\", \"lunch\", \"dinner\" and \"other\""
      ],
      [
        "date",
        "Int",
        true,
        "Number of days since January 1, 1970 (default value is the current day)"
      ]
    ],
    "apiMethod": "food_entries.copy_saved_meal"
  },
  {
    "name": "food_entries.get",
    "source": "https://platform.fatsecret.com/docs/v2/food_entries.get",
    "title": "Profile - Food Diary: Get All Entries",
    "description": "Returns saved food diary entries for the user according to the filter specified. This method can be used to return all food diary entries recorded on a nominated date or a single food diary entry with a nominated food_entry_id.",
    "endpoint": "https://platform.fatsecret.com/rest/food-entries/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "date",
        "Int",
        false,
        "Number of days since January 1, 1970 (default value is the current day)"
      ],
      [
        "food_entry_id",
        "Long",
        false,
        "Unique identifier of the food diary entry"
      ]
    ],
    "apiMethod": "food_entries.get.v2"
  },
  {
    "name": "food_entries.get_month",
    "source": "https://platform.fatsecret.com/docs/v2/food_entries.get_month",
    "title": "Profile - Food Diary: Get All Entries For Month",
    "description": "Returns summary daily nutritional information for a user's food diary entries for the month specified. Use this call to display nutritional information to users about their food intake for a nominated month. Days with no food diary entries are not included.",
    "endpoint": "https://platform.fatsecret.com/rest/food-entries/month/v1",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "date",
        "Int",
        true,
        "Number of days since January 1, 1970 (default value is the current day)"
      ]
    ],
    "apiMethod": "food_entries.get_month.v2"
  },
  {
    "name": "food_entry.create",
    "source": "https://platform.fatsecret.com/docs/v1/food_entry.create",
    "title": "Profile - Food Diary: Create Entry By Id",
    "description": "Records a food diary entry for the user according to the parameters specified.",
    "endpoint": "https://platform.fatsecret.com/rest/food-entries/v1",
    "httpMethod": "POST",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "food_id",
        "Long",
        true,
        "Unique food identifier"
      ],
      [
        "food_entry_name",
        "String",
        true,
        "A description of the food item as entered by the user; typically the name of the food. E.G.: \"Instant Oatmeal\""
      ],
      [
        "serving_id",
        "Long",
        true,
        "Unique serving identifier"
      ],
      [
        "number_of_units",
        "Decimal",
        true,
        "Number of units in this standard serving size. For instance, if the serving description is \"2 tablespoons\" the number of units is \"2\", while if the serving size is \"1 cup\" the number of units is \"1\". Please note that this is only applicable for when food_type is \"Generic\" whereas for \"Brand\" the number of units will always be \"1\""
      ],
      [
        "meal",
        "String",
        true,
        "Type of meal eaten. Valid meal types are \"breakfast\", \"lunch\", \"dinner\" and \"other\""
      ],
      [
        "date",
        "Int",
        true,
        "Number of days since January 1, 1970 (default value is the current day)"
      ]
    ],
    "apiMethod": "food_entry.create"
  },
  {
    "name": "food_entry.edit",
    "source": "https://platform.fatsecret.com/docs/v1/food_entry.edit",
    "title": "Profile - Food Diary: Edit Entry By Id",
    "description": "Adjusts the recorded values for a food diary entry. Note that the date of the entry may not be adjusted, however one or more of the other remaining properties – food_entry_name, serving_id, number_of_units, or meal may be altered. In order to shift the date for which a food diary entry was recorded the original entry must be deleted and a new entry recorded.",
    "endpoint": "https://platform.fatsecret.com/rest/food-entries/v1",
    "httpMethod": "PUT",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "food_entry_id",
        "Long",
        true,
        "Unique identifier of the food diary entry"
      ],
      [
        "food_entry_name",
        "String",
        false,
        "A description of the food item as entered by the user; typically the name of the food. E.G.: \"Instant Oatmeal\""
      ],
      [
        "serving_id",
        "Long",
        false,
        "Unique serving identifier"
      ],
      [
        "number_of_units",
        "Decimal",
        false,
        "Number of units in this standard serving size. For instance, if the serving description is \"2 tablespoons\" the number of units is \"2\", while if the serving size is \"1 cup\" the number of units is \"1\". Please note that this is only applicable for when food_type is \"Generic\" whereas for \"Brand\" the number of units will always be \"1\""
      ],
      [
        "meal",
        "String",
        false,
        "Type of meal eaten. Valid meal types are \"breakfast\", \"lunch\", \"dinner\" and \"other\""
      ]
    ],
    "apiMethod": "food_entry.edit"
  },
  {
    "name": "food_entry.delete",
    "source": "https://platform.fatsecret.com/docs/v1/food_entry.delete",
    "title": "Profile - Food Diary: Delete Entry By Id",
    "description": "Deletes the specified food entry for the user.",
    "endpoint": "https://platform.fatsecret.com/rest/food-entries/v1",
    "httpMethod": "DELETE",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "food_entry_id",
        "Long",
        true,
        "Unique identifier of the food diary entry"
      ]
    ],
    "apiMethod": "food_entry.delete"
  },
  {
    "name": "exercises.get",
    "source": "https://platform.fatsecret.com/docs/v2/exercises.get",
    "title": "Exercises: Get All",
    "description": "This is a utility method, returning the full list of all supported exercise type names and their associated unique identifiers.",
    "endpoint": "https://platform.fatsecret.com/rest/exercises/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "region",
        "String",
        false,
        "Results will be filtered by region. E.G.: \"FR\" returns results from France. If not specified this will default to \"US\" (United States). Click here for full documentation on localization."
      ],
      [
        "language",
        "String",
        false,
        "(Ignored unless region is also specified) Results will be in the specified language. E.G.: \"fr\" returns results in French"
      ]
    ],
    "apiMethod": "exercises.get.v2"
  },
  {
    "name": "exercise_entries.commit_day",
    "source": "https://platform.fatsecret.com/docs/v1/exercise_entries.commit_day",
    "title": "Profile - Exercise Diary: Commit Day",
    "description": "Saves the default exercise entries for the user on a nominated date. The API will always return 24 hours worth of exercise entries for a given user on a given date. Users can set up and save standard routines for the activities they do on any given day of the week, known as \"template\" exercise entries. When the exercise entries are retrieved for a day that has not previously been committed or adjusted by the user a set of 24 hours worth of \"template\" or default entries will be returned. The exercise_entries.commit_day method takes the current \"template\" exercise entries and saves them to the exercise diary. Calling this method is in effect an acknowledgement on behalf of a user that they undertook the activities presented in the template.",
    "endpoint": "https://platform.fatsecret.com/rest/exercise-entries/day/v1",
    "httpMethod": "POST",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "date",
        "Int",
        true,
        "Number of days since January 1, 1970 (default value is the current day)"
      ]
    ],
    "apiMethod": "exercise_entries.commit_day"
  },
  {
    "name": "exercise_entries.get",
    "source": "https://platform.fatsecret.com/docs/v2/exercise_entries.get",
    "title": "Profile - Exercise Diary: Get All For Date",
    "description": "Returns the daily exercise entries for the user on a nominated date. The API will always return 24 hours worth of exercise entries for a given user on a given date. These entries will either be \"template\" entries (which a user may override for any given day of the week) or saved exercise entry values. Once a user saves or updates the entries on any given day, all entries for that day are saved. All adjustments to the day involve reducing the time for an existing activity in order to either add or increase the time taken for another activity. The default entries presented for a user for a given day of the week can be overridden using exercise_entries.save_template.",
    "endpoint": "https://platform.fatsecret.com/rest/exercise-entries/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "date",
        "Int",
        true,
        "Number of days since January 1, 1970 (default value is the current day)"
      ]
    ],
    "apiMethod": "exercise_entries.get.v2"
  },
  {
    "name": "exercise_entries.get_month",
    "source": "https://platform.fatsecret.com/docs/v2/exercise_entries.get_month",
    "title": "Profile - Exercise Diary: Get Calories Expended For Month",
    "description": "Returns the summary estimated daily calories expended for a user's exercise diary entries for the month specified. Use this call to display total energy expenditure information to users about their exercise and activities for a nominated month. Days with no saved exercise diary entries are not included.",
    "endpoint": "https://platform.fatsecret.com/rest/exercise-entries/month/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "date",
        "Int",
        true,
        "Number of days since January 1, 1970 (default value is the current day)"
      ]
    ],
    "apiMethod": "exercise_entries.get_month.v2"
  },
  {
    "name": "exercise_entries.save_template",
    "source": "https://platform.fatsecret.com/docs/v1/exercise_entries.save_template",
    "title": "Profile - Exercise Diary: Save Template",
    "description": "Takes the set of exercise entries on a nominated date and saves these entries as \"template\" entries for nominated days of the week. By default, the template daily exercise entries for all users for all days of the week are: 8 hours of \"Sleeping\" 16 hours of \"Resting\" his method is used to take the saved entries on for a nominated date and to copy them for one or more days of the week as the template daily exercise entries. So, for instance, if a user records 1 hour of walking, 8 hours of sleeping and 15 hours of resting for a particular day in their exercise diary, and then saves that date as a template for Saturday and Sunday, these three activities will be presented as the default exercise entries for all future Saturdays and Sundays.",
    "endpoint": "https://platform.fatsecret.com/rest/exercise-entries/template/v1",
    "httpMethod": "POST",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "days",
        "Int",
        true,
        "The days of the week specified as bits with Sunday being the 1st bit and Saturday being the last and then converted to an Int. For example Tuesday and Thursday would be represented as 00010100 in bits or 20 in Int where Tuesday is the 3rd bit from the right and Thursday being the 5th. Must be between 0 and 128"
      ],
      [
        "date",
        "Int",
        true,
        "Number of days since January 1, 1970 (default value is the current day)"
      ]
    ],
    "apiMethod": "exercise_entries.save_template"
  },
  {
    "name": "exercise_entry.edit",
    "source": "https://platform.fatsecret.com/docs/v1/exercise_entry.edit",
    "title": "Profile - Exercise Diary: Edit Entries For Date",
    "description": "Records a change to a user's exercise diary entry for a nominated date. All changes to an exercise diary involve either increasing the duration of an existing activity or introducing a new activity for a nominated duration. Because there are always 24 hours worth of exercise entries on any given date, the user must nominate the exercise or activity from which the time was taken to balance out the total duration of activities and exercises for the 24 hour period. As such, each change to the exercise entries on a given day is a \"shifting\" operation where time is moved from one activity to another. An exercise is removed from the day when all of the time allocated to it is shifted to other exercises.",
    "endpoint": "https://platform.fatsecret.com/rest/exercise-entries/template/v1",
    "httpMethod": "PUT",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "shift_to_id",
        "Long",
        true,
        "ID of the exercise type to shift to"
      ],
      [
        "shift_from_id",
        "Long",
        true,
        "ID of the exercise type to shift from"
      ],
      [
        "minutes",
        "Int",
        true,
        "Duration in minutes"
      ],
      [
        "date",
        "Int",
        true,
        "Number of days since January 1, 1970 (default value is the current day)"
      ],
      [
        "shift_to_name",
        "String",
        false,
        "Only required if shift_to_id is 0 (exercise type \"Other\"). This is the name of the new custom exercise type to shift to"
      ],
      [
        "shift_from_name",
        "String",
        false,
        "Only required if shift_from_id is 0 (exercise type \"Other\"). This is the name of the custom exercise type to shift from"
      ],
      [
        "kcal",
        "Int",
        false,
        "Only required if shift_to_id is 0 (exercise type \"Other\"). This is the total number of kcals burned for this exercise"
      ]
    ],
    "apiMethod": "exercise_entry.edit"
  },
  {
    "name": "weight.update",
    "source": "https://platform.fatsecret.com/docs/v1/weight.update",
    "title": "Profile - Weight Diary: Update For Date",
    "description": "Records a user's weight for a nominated date. First time weigh-ins require the goal_weight_kg and current_height_cm parameters. Please note as per the API Terms of Use that it is your responsibility to ensure that the information generated by using the API is not be interpreted as a substitute for medical physician consultation, evaluation, or treatment.",
    "endpoint": "https://platform.fatsecret.com/rest/weight/v1",
    "httpMethod": "POST",
    "encoding": "form",
    "write": true,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "current_weight_kg",
        "Decimal",
        true,
        "Current weight of the user in kilograms"
      ],
      [
        "date",
        "Int",
        true,
        "Number of days since January 1, 1970 (default value is the current day)"
      ],
      [
        "weight_type",
        "String",
        false,
        "Weight measurement type for this user profile. Valid types are \"kg\" and \"lb\" (default value is \"kg\")"
      ],
      [
        "height_type",
        "String",
        false,
        "Height measurement type for this user profile. Valid types are \"cm\" and \"inch\" (default value is \"cm\")"
      ],
      [
        "goal_weight_kg",
        "Decimal",
        false,
        "User's goal weight in kilograms"
      ],
      [
        "current_height_cm",
        "Decimal",
        false,
        "Current height of the user in centimetres. This is required for the first weigh-in. You can only set this for the first time"
      ],
      [
        "comment",
        "String",
        false,
        "A comment for this weigh-in"
      ]
    ],
    "apiMethod": "weight.update"
  },
  {
    "name": "weights.get_month",
    "source": "https://platform.fatsecret.com/docs/v2/weights.get_month",
    "title": "Profile - Weight Diary: Get For Month",
    "description": "Returns the recorded weights for a user for the month specified. Use this call to display a user's weight chart or log of weight changes for a nominated month. The day elements returned are those where the user entered or updated their weight for the specified month. Days with no recorded weight are not included.",
    "endpoint": "https://platform.fatsecret.com/rest/weight/month/v2",
    "httpMethod": "GET",
    "encoding": "form",
    "write": false,
    "delegated": true,
    "premier": false,
    "parameters": [
      [
        "date",
        "Int",
        true,
        "Number of days since January 1, 1970 (default value is the current day)"
      ]
    ],
    "apiMethod": "weights.get_month.v2"
  }
];
