const form = document.getElementById('character-form');
form.noValidate = true;

const TAKEN_NAMES = ["Admin", "ShadowLord", "Hero", "TestUser", "God"];

const nameInput = document.getElementById('char-name');
const classSelect = document.getElementById('char-class');
const colorInput = document.getElementById('char-color');
const skillInputs = document.querySelectorAll('.skill-input');
const strInput = document.getElementById('skill-strength');
const agiInput = document.getElementById('skill-agility');
const magInput = document.getElementById('skill-magic');
const vitInput = document.getElementById('skill-vitality');

const pointsLeftEl = document.getElementById('points-left');
const errorSummaryEl = document.getElementById('form-error-summary');
const resultContainer = document.getElementById('character-result');

const previewName = document.getElementById('preview-name');
const previewClass = document.getElementById('preview-class');
const previewCardBox = document.getElementById('preview-card-box');
const prevStr = document.getElementById('prev-str');
const prevAgi = document.getElementById('prev-agi');
const prevMag = document.getElementById('prev-mag');
const prevVit = document.getElementById('prev-vit');

const touchedFields = new Set();

function getTotalSkillPoints() {
  let total = 0;
  skillInputs.forEach(input => {
    total += Number(input.value) || 0;
  });
  return total;
}

function updateLivePreview() {
  // Name
  const nameVal = nameInput.value.trim();
  previewName.textContent = nameVal ? `Name: ${nameVal}` : "Name: [Not Set]";

  // Class
  const classVal = classSelect.value;
  previewClass.textContent = classVal || "None";

  // Theme Color (applied to preview card border)
  const colorVal = colorInput.value;
  previewCardBox.style.borderColor = colorVal;

  // Skills
  prevStr.textContent = strInput.value || 0;
  prevAgi.textContent = agiInput.value || 0;
  prevMag.textContent = magInput.value || 0;
  prevVit.textContent = vitInput.value || 0;

  // Points left
  const total = getTotalSkillPoints();
  const left = 20 - total;
  pointsLeftEl.textContent = left;
  pointsLeftEl.style.color = left < 0 ? '#ef4444' : (left === 0 ? '#10b981' : '#f1f5f9');
}

function validateField(field) {
  const errorSpan = document.getElementById(`error-${field.id}`);
  let errorMessage = "";

  if (field === nameInput) {
    const val = nameInput.value.trim();
    if (val === "") {
      errorMessage = "Character name cannot be empty.";
    } else if (val.length < 3) {
      errorMessage = "Name must be at least 3 characters long.";
    } else if (TAKEN_NAMES.includes(val)) {
      errorMessage = "This name is already taken. Choose another one.";
    }
  } else if (field === classSelect) {
    if (classSelect.value === "") {
      errorMessage = "Please select a character class.";
    } else {
      const magic = Number(magInput.value) || 0;
      const strength = Number(strInput.value) || 0;
      const agility = Number(agiInput.value) || 0;

      if (classSelect.value === "Mage" && magic < 5) {
        errorMessage = "Mage class requires Magic to be at least 5.";
      } else if (classSelect.value === "Warrior" && strength < 6) {
        errorMessage = "Warrior class requires Strength to be at least 6.";
      } else if (classSelect.value === "Rogue" && agility < 6) {
        errorMessage = "Rogue class requires Agility to be at least 6.";
      }
    }
  } else if (Array.from(skillInputs).includes(field)) {
    const val = Number(field.value);
    if (isNaN(val) || val < 1 || val > 10) {
      errorMessage = "Skill value must be between 1 and 10.";
    }
  }

  if (errorMessage) {
    field.setAttribute('aria-invalid', 'true');
    if (errorSpan) errorSpan.textContent = errorMessage;
  } else {
    field.removeAttribute('aria-invalid');
    if (errorSpan) errorSpan.textContent = "";
  }

  return errorMessage;
}

function validateSkillsTotal() {
  const total = getTotalSkillPoints();
  const skillsErrorSpan = document.getElementById('error-skills');
  let error = "";

  if (total !== 20) {
    error = `Total skill points must equal exactly 20 (Current: ${total}).`;
    skillsErrorSpan.textContent = error;
  } else {
    skillsErrorSpan.textContent = "";
  }
  return error;
}

// Event listeners for blur and input
const allFields = [nameInput, classSelect, colorInput, ...skillInputs];

allFields.forEach(field => {
  field.addEventListener('blur', () => {
    touchedFields.add(field);
    validateField(field);
    if (Array.from(skillInputs).includes(field)) {
      validateSkillsTotal();
    }
  });

  field.addEventListener('input', () => {
    updateLivePreview();
    if (touchedFields.has(field)) {
      validateField(field);
    }
    if (Array.from(skillInputs).includes(field)) {
      validateSkillsTotal();
    }
    if (classSelect.value) {
      validateField(classSelect);
    }
  });
});

// Form submission handler
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  allFields.forEach(f => touchedFields.add(f));

  let errors = [];
  allFields.forEach(field => {
    const err = validateField(field);
    if (err) errors.push({ field, message: err });
  });

  const skillsErr = validateSkillsTotal();
  if (skillsErr) {
    errors.push({ field: strInput, message: skillsErr });
  }

  if (errors.length > 0) {
    errorSummaryEl.textContent = `Form submission failed with ${errors.length} error(s). Please fix them below.`;
    resultContainer.style.display = 'none';
    errors[0].field.focus();
  } else {
    errorSummaryEl.textContent = "";
    
    // Success: build result with DOM and reset form
    resultContainer.innerHTML = "";
    resultContainer.style.display = 'block';

    const successTitle = document.createElement('h4');
    successTitle.textContent = "Character Successfully Created!";
    resultContainer.appendChild(successTitle);

    const infoList = document.createElement('ul');
    infoList.style.listStyle = 'none';
    infoList.style.marginTop = '8px';

    const items = [
      `Name: ${nameInput.value.trim()}`,
      `Class: ${classSelect.value}`,
      `Theme Color: ${colorInput.value}`,
      `Strength: ${strInput.value}`,
      `Agility: ${agiInput.value}`,
      `Magic: ${magicValue = magInput.value}`,
      `Vitality: ${vitInput.value}`
    ];

    items.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      infoList.appendChild(li);
    });

    resultContainer.appendChild(infoList);

    form.reset();
    touchedFields.clear();
    document.getElementById('error-skills').textContent = "";
    allFields.forEach(f => f.removeAttribute('aria-invalid'));
    updateLivePreview();
  }
});

updateLivePreview();