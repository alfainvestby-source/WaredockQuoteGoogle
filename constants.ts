import { FormDefinition } from './types';

export const QUOTE_FORM_DEFINITION: FormDefinition = {
  "id": 9,
  "title": "Request for Quote (#7)",
  "form_fields": {
    "fields": [
      {
        "index": 0,
        "element": "input_name",
        "attributes": { "name": "names", "data-type": "name-element" },
        "settings": {
          "container_class": "",
          "admin_field_label": "Name",
          "label_placement": ""
        },
        "fields": {
          "first_name": {
            "element": "input_text",
            "attributes": { "type": "text", "name": "first_name", "value": "", "placeholder": "" },
            "settings": {
              "label": "First Name",
              "validation_rules": { "required": { "value": true, "message": "This field is required" } }
            }
          },
          "last_name": {
            "element": "input_text",
            "attributes": { "type": "text", "name": "last_name", "value": "", "placeholder": "" },
            "settings": {
              "label": "Last Name",
              "validation_rules": { "required": { "value": true, "message": "This field is required" } }
            }
          }
        },
        "uniqElKey": "el_1559111679342"
      },
      {
        "index": 2,
        "element": "input_text",
        "attributes": { "type": "text", "name": "input_company", "value": "", "placeholder": "" },
        "settings": {
          "label": "Company Name",
          "validation_rules": { "required": { "value": true, "message": "We need a company name. If you have not registered a company yet, please write NA" } }
        },
        "uniqElKey": "el_1643224802061"
      },
      {
        "index": 1,
        "element": "input_email",
        "attributes": { "type": "email", "name": "email", "value": "", "placeholder": "" },
        "settings": {
          "label": "Email",
          "validation_rules": {
            "required": { "value": true, "message": "We need your email for any questions we may have" },
            "email": { "value": true, "message": "This field must contain a valid email" }
          }
        },
        "uniqElKey": "el_1559111716176"
      },
      {
        "index": 1,
        "element": "input_text",
        "attributes": { "type": "tel", "name": "phone", "value": "", "placeholder": "e.g., +1 234 567 890" },
        "settings": {
          "label": "Phone Number",
          "validation_rules": { "required": { "value": true, "message": "Your phone number is required." } }
        },
        "uniqElKey": "el_1683491564460"
      },
      {
        "index": 2,
        "element": "input_text",
        "attributes": { "type": "text", "name": "url", "value": "", "placeholder": "" },
        "settings": { "label": "Company Website", "validation_rules": { "required": { "value": false, "message": "This field is required" } } },
        "uniqElKey": "el_1683491564459"
      },
      {
        "index": 7,
        "element": "checkbox_group",
        "attributes": { "name": "ecommerce_platform" },
        "settings": {
          "label": "eCommerce platform(s)",
          "help_message": "Select all that apply. You may have several channels.",
          "advanced_options": [
            { "label": "None", "value": "None" },
            { "label": "Allegro", "value": "Allegro" },
            { "label": "Amazon", "value": "Amazon" },
            { "label": "eBay", "value": "eBay" },
            { "label": "Magento", "value": "Magento" },
            { "label": "Prestashop", "value": "Prestashop" },
            { "label": "Shopify", "value": "Shopify" },
            { "label": "Shopware", "value": "Shopware" },
            { "label": "Wix", "value": "Wix" },
            { "label": "WooCommerce", "value": "WooCommerce" },
            { "label": "Other", "value": "Other" }
          ],
          "validation_rules": { "required": { "value": true, "message": "This field is required" } }
        },
        "uniqElKey": "el_1683377998646"
      },
      {
        "index": 2,
        "element": "input_text",
        "attributes": { "type": "text", "name": "ecommerce_platform_OTHER", "value": "", "placeholder": "" },
        "settings": {
          "label": "What other eCommerce platform are you using please?",
          "help_message": "Enter the name of eCommerce solution that you use.",
          "validation_rules": { "required": { "value": true, "message": "Please tell us the name of the platform." } },
          "conditional_logics": { "status": true, "type": "any", "conditions": [{ "field": "ecommerce_platform", "value": "Other", "operator": "=" }] }
        },
        "uniqElKey": "el_1683377453530"
      },
      {
        "index": 10,
        "element": "gdpr_agreement",
        "attributes": { "type": "checkbox", "name": "gdpr-agreement", "value": false },
        "settings": {
          "label": "GDPR Agreement",
          "tnc_html": "I consent to have this website store my submitted information so they can respond to my inquiry",
          "has_checkbox": true,
          "validation_rules": { "required": { "value": true, "message": "You must agree to the terms." } }
        },
        "uniqElKey": "el_1643228528195"
      },
      { "index": 7, "element": "form_step", "attributes": {}, "settings": {}, "uniqElKey": "el_1643223313180" },
      {
        "index": 7,
        "element": "select",
        "attributes": { "name": "product_category" },
        "settings": {
          "label": "📦 Your main product category",
          "placeholder": "- Select -",
          "advanced_options": [
            { "label": "Fashion & Apparel (clothing, accessories, shoes)", "value": "Fashion & Apparel" },
            { "label": "Food & Beverage (food, drinks, specialty food items)", "value": "Food & Beverage" },
            { "label": "Health & Wellness (nutrition, medical, CBD, wellness products)", "value": "Health & Wellness" },
            { "label": "Beauty & Personal Care (cosmetics, grooming, perfumes)", "value": "Beauty & Personal Care" },
            { "label": "Home & Living (furniture, decor, home textiles, lighting)", "value": "Home & Living" },
            { "label": "Technology & Electronics (tech gadgets, phones, electronics)", "value": "Technology & Electronics" },
            { "label": "Business & Industrial (industrial equipment, chemicals, materials)", "value": "Business & Industrial" },
            { "label": "Office & Stationery (office supplies, packaging, stationery)", "value": "Office & Stationery" },
            { "label": "Sports & Outdoor (fitness, sporting goods, outdoor equipment)", "value": "Sports & Outdoor" },
            { "label": "Building & Construction (construction materials, tools, building supplies)", "value": "Building & Construction" },
            { "label": "Specialty Products (niche items like tobacco alternatives, research products, specialized supplies)", "value": "Specialty Products" },
            { "label": "Other", "value": "Other" }
          ],
          "validation_rules": { "required": { "value": true, "message": "This field is required" } }
        },
        "uniqElKey": "el_1683382947536"
      },
      {
        "index": 2,
        "element": "input_text",
        "attributes": { "type": "text", "name": "product_category_OTHER", "value": "", "placeholder": "" },
        "settings": {
          "label": "What other product category are you selling?",
          "validation_rules": { "required": { "value": true, "message": "This field is required" } },
          "conditional_logics": { "status": true, "type": "any", "conditions": [{ "field": "product_category", "value": "Other", "operator": "=" }] }
        },
        "uniqElKey": "el_1683394274813"
      },
      {
        "index": 7,
        "element": "select",
        "attributes": { "name": "warehouse_location" },
        "settings": {
          "label": "In what country are you looking for a fulfillment center? 🌍",
          "help_message": "Choose what market you would like to find a fulfillment solution for.",
          "placeholder": "- Select preferred location -",
          "advanced_options": [
            { "label": "Estonia", "value": "Estonia" },
            { "label": "Finland", "value": "Finland" },
            { "label": "Germany", "value": "Germany" },
            { "label": "Netherlands", "value": "Netherlands" },
            { "label": "Poland", "value": "Poland" },
            { "label": "Sweden", "value": "Sweden" },
            { "label": "United Kingdom", "value": "United Kingdom" },
            { "label": "USA", "value": "USA" },
            { "label": "OTHER", "value": "OTHER" }
          ],
          "validation_rules": { "required": { "value": true, "message": "This field is required" } }
        },
        "uniqElKey": "el_1683382934511"
      },
      {
        "index": 2,
        "element": "input_text",
        "attributes": { "type": "text", "name": "warehouse_location_OTHER", "value": "" },
        "settings": {
          "label": "In which other country are you looking for fulfillment center?",
          "validation_rules": { "required": { "value": true, "message": "We need to know the country to be able to help you!" } },
          "conditional_logics": { "status": true, "type": "any", "conditions": [{ "field": "warehouse_location", "value": "OTHER", "operator": "=" }] }
        },
        "uniqElKey": "el_1683394289917"
      },
      {
        "index": 7,
        "element": "select",
        "attributes": { "name": "B2C_orders" },
        "settings": {
          "label": "🚚 Current B2C orders per month",
          "help_message": "Enter your current number of B2C orders per month. Please be as accurate as possible.",
          "placeholder": "- Select -",
          "advanced_options": [
            { "label": "0-100 / month", "value": "0-100/month" },
            { "label": "101-250 / month", "value": "101-250/month" },
            { "label": "251-500 / month", "value": "251-500/month" },
            { "label": "501-1,000 / month", "value": "501-1,000/month" },
            { "label": "1,001-2,500 / month", "value": "1,001-2,500/month" }
          ],
          "validation_rules": { "required": { "value": true, "message": "This field is required" } }
        },
        "uniqElKey": "el_1683382938299"
      },
      {
        "index": 6,
        "element": "input_number",
        "attributes": { "type": "number", "name": "SKUcount", "value": "", "placeholder": "e.g., 50" },
        "settings": {
          "label": "👕 How many unique products (SKUs) does your store have?",
          "help_message": "The approximate number of unique product variants.",
          "validation_rules": { "required": { "value": true, "message": "This field is required" } }
        },
        "uniqElKey": "el_1643228136174"
      },
      {
        "index": 6,
        "element": "input_number",
        "attributes": { "type": "number", "name": "pick_count", "value": "", "placeholder": "e.g., 2" },
        "settings": {
          "label": "🤏 Average number of items per order?",
          "help_message": "On average, how many individual items are in a single customer order.",
          "validation_rules": { "required": { "value": true, "message": "This field is required" } }
        },
        "uniqElKey": "el_1643228227949"
      }
    ],
    "stepsWrapper": {
      "stepStart": {
        "settings": {
          "step_titles": ["Your Details", "Fulfillment Basics"]
        }
      }
    }
  }
};