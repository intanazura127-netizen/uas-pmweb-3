# Contribution Guidelines

## 🤝 Contributing to Blockchain App

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 📋 Before You Start

- Read [README.md](README.md)
- Understand the project structure
- Have Node.js and Git installed
- Fork and clone the repository

## 🔄 Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Changes
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 3. Commit Changes
```bash
git add .
git commit -m "feat: add new feature" # or "fix: bug description"
```

### 4. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Create Pull Request on GitHub with description of changes.

## 📝 Code Style Guidelines

### JavaScript/React
```javascript
// Use const/let, not var
const myVariable = 'value';

// Use arrow functions
const handleClick = () => { };

// Use template literals
const message = `Hello, ${name}!`;

// Use destructuring
const { name, age } = person;

// Use meaningful names
const fetchTransactions = () => { }; // Good
const ft = () => { }; // Bad
```

### CSS
```css
/* Use meaningful class names */
.transaction-list { } /* Good */
.tl { } /* Bad */

/* Follow BEM naming convention */
.block__element--modifier { }

/* Group related properties */
.card {
  /* Layout */
  display: flex;
  gap: 1rem;
  
  /* Sizing */
  width: 100%;
  padding: 1rem;
  
  /* Styling */
  background: white;
  border-radius: 8px;
}
```

### Solidity
```solidity
// Use meaningful function names
function getDonations() { } // Good
function getD() { } // Bad

// Add comments for complex logic
/// @dev Calculates total donations
function calculateTotal() { }

// Use consistent naming
uint256 totalAmount; // Good
uint total_amount; // Avoid
```

## 🧪 Testing

- Test changes locally before submitting PR
- Test on multiple browsers (Chrome, Firefox, Edge)
- Test responsive design on mobile
- Test MetaMask connection

## 📚 Documentation

- Update README.md for new features
- Add comments to complex code
- Document new API endpoints
- Update LEARNING_GUIDE.md if needed

## 🎯 Types of Contributions

### Bug Fixes
1. Describe bug clearly
2. Provide reproduction steps
3. Test the fix
4. Reference issue number

### Features
1. Propose feature in issue first
2. Discuss implementation approach
3. Follow project architecture
4. Add tests and documentation

### Documentation
1. Fix typos and errors
2. Improve clarity
3. Add examples
4. Keep consistent style

## ✅ Before Submitting PR

- [ ] Code follows style guidelines
- [ ] No console errors or warnings
- [ ] Tested on multiple browsers
- [ ] Updated relevant documentation
- [ ] Meaningful commit messages
- [ ] No hard-coded values or credentials
- [ ] Environment variables used appropriately

## 🐛 Reporting Bugs

Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS version
- MetaMask version
- Screenshots/console errors

## 💡 Suggesting Features

- Describe use case
- Explain how it benefits users
- Consider implementation complexity
- Suggest technical approach if possible

## 📞 Getting Help

- Comment on existing issues
- Create new discussion
- Check documentation first
- Look at existing code patterns

## 🔐 Security

- Don't commit secrets
- Report security issues privately
- Follow secure coding practices
- Keep dependencies updated

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
