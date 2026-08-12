const fs = require('fs');
const path = require('path');
const dir = 'src/infra/http/controllers';
const files = fs.readdirSync(dir);

const mapping = {
  'category': 'categories',
  'food': 'foods',
  'meal': 'meals',
  'waste': 'wastes',
  'mealItem': 'mealItems',
  'mealItens': 'mealItems'
};

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    content = content.replace(/@Controller\('\/(category|food|meal|waste|mealItem|mealItens)(?=\/|')/g, (match, p1) => {
      return `@Controller('/${mapping[p1]}`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated ' + file);
    }
  }
});
