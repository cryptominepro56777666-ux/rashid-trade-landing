# Website Fix Tasks

## 1. Fix About Page
- [x] Replace raw HTML display with proper content
- [x] Add investment explanation section
- [x] Add "How It Works" section
- [x] Add plan cards (Basic, Pro, Ultra) with "Buy Now" buttons

## 2. Update Headers Across All Pages
- [ ] Make header uniform across all pages
- [ ] Add deposit link to navigation
- [ ] Fix broken links

## 3. Add Investment Plans
- [ ] Add plan selection to about.html
- [ ] "Buy Now" buttons redirect to deposit.html with auto-filled amount

## 4. Implement Fake Google Login
- [ ] Update login modal to auto-close on Google login
- [ ] Store login session in localStorage
- [ ] Protect dashboard: redirect if not logged in

## 5. Create Professional Dashboard
- [ ] Build full dashboard.html structure
- [ ] Add portfolio card
- [ ] Add active plan card
- [ ] Add profit chart (fake line chart)
- [ ] Add transaction history table
- [ ] Add top bar with logout

## 6. Update Deposit Page
- [ ] Ensure TRC20 wallet address is set
- [ ] Ensure Trust Wallet link is set
- [ ] Add auto-fill amount from plan selection
- [ ] Ensure QR code generation

## 7. Fix Traders Table
- [ ] Update traders list with fake names: Rashid Ali, Alex Morgan, John Carter, Bella Singh, CryptoGhost, ProfitMaster
- [ ] Fix "View" button: open fake login modal if not logged in, then redirect to trader.html

## 8. Update Trader Page
- [ ] Remove access code prompt
- [ ] Use login session check instead

## 9. Update Script.js
- [ ] Add login session protection
- [ ] Update traders data
- [ ] Add plan selection and deposit auto-fill logic
- [ ] Update dashboard population

## 10. Update Styles.css
- [ ] Add styles for dashboard cards
- [ ] Add styles for profit chart
- [ ] Add responsive styles

## 11. Convert Links to Relative
- [ ] Update all href to "./page.html"
- [ ] Remove leading "/"

## 12. Final Cleanup
- [x] Ensure all pages load correctly
- [x] Test login flow
- [x] Test deposit flow
- [x] Optimize for GitHub Pages
