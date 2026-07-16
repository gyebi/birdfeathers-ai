# BirdFeathers Native Mobile Rebuild Plan

## Decision

BirdFeathers will be **rebuilt as a native Android and iOS application using React Native, Expo, and TypeScript**.

This is a full mobile-interface rebuild, not a WebView wrapper around the existing website. The current web application will serve as the product reference and source of business requirements, formulas, branding, copy, and user-flow knowledge.

The new application will use native interface components and a shared React Native codebase for Android and iOS. Expo will provide the application framework, development tooling, native integrations, and build workflow.

## Why React Native and Expo

BirdFeathers is intended to grow beyond a basic calculator into a polished poultry management product. React Native with Expo provides a stronger long-term foundation for:

- Native Android and iOS user experiences
- Reliable navigation and mobile form handling
- Offline farm records and structured local storage
- Secure authentication and cloud synchronization
- Push notifications and farming reminders
- Camera, file sharing, PDF export, and other device features
- App Store and Google Play distribution
- Shared application logic across both mobile platforms

Capacitor could package the existing website more quickly, but it would preserve the current DOM-based architecture and render the application inside a native web container. That approach does not match the long-term product direction. Flutter is also capable, but it would require rewriting both the interface and the existing JavaScript business logic in Dart.

React Native is the best fit because the project can retain JavaScript expertise and reuse properly extracted calculation logic while still producing a genuinely native interface.

## What Will Be Reused

The migration will preserve and refine:

- Poultry calculation requirements and formulas
- Broiler and layer production concepts
- Application state and data concepts
- Currency, locale, and country requirements
- Firebase Cloud Functions and backend infrastructure
- Images, branding, colors, and written content
- The overall guided-calculation workflow
- Existing product knowledge captured in the web prototype

## What Will Be Rebuilt

The following web-specific implementation will not be carried directly into the native application:

- HTML pages
- CSS stylesheets
- DOM manipulation
- Browser routing
- `localStorage` persistence
- Service-worker behavior
- Direct use of `document`, `innerHTML`, and browser events

These areas will be replaced with React Native screens, components, navigation, native storage, and platform-appropriate application services.

## Initial Product Scope

The recommended first native release should focus on:

- Broiler, layer, and combined-flock calculations
- Feed, mortality, production, cost, and revenue inputs
- Calculation results and gross-margin summaries
- Saved production cycles and history
- Secure AI-generated insights
- Country, currency, locale, and language settings
- Offline-first operation
- Optional user accounts and cloud backup

Features such as multi-farm management, health records, vaccination reminders, market-price feeds, subscriptions, and advanced reporting should follow after the core calculator is stable.

## Architecture

The native application should use clearly separated layers:

```text
React Native screens and components
            ↓
Application state and validation
            ↓
Poultry calculation engine
            ↓
Local database and Firebase services
            ↓
Cloud Functions and AI services
```

The calculation engine must remain independent of the interface. It should accept validated inputs and return structured results without knowing about React Native, Android, iOS, or individual screens.

This separation will provide:

- Automated formula testing
- Consistent results on Android and iOS
- Easier correction of assumptions
- Safer financial calculations
- Potential reuse in a future web application

## Formula and Product Review

Before the native interface is implemented, all business rules must be documented and verified, including:

- Feed consumption by bird type and production stage
- Feed-bag rounding rules
- Chick and pullet acquisition costs
- Mortality calculations
- Broiler production duration
- Layer production curves
- Egg-production cycle length
- Cull thresholds and culling dates
- Egg and crate pricing
- Bird resale revenue
- Operational costs included and excluded

The current application describes its final result as profit. Because housing, labor, medication, utilities, transport, financing, equipment, and other operating costs may be excluded, the native application should normally describe this result as an **estimated gross margin** unless all relevant expenses are captured.

## Proposed Navigation

The main native navigation should contain:

- Home
- New Calculation
- History
- Settings

The calculation should be a guided screen flow:

1. Select bird type
2. Enter flock quantities
3. Enter bird acquisition costs
4. Set production duration and profile
5. Enter feed requirements and prices
6. Enter expected mortality
7. Enter sales and revenue assumptions
8. Review the calculation
9. View and save results

AI insights should be available from a saved result rather than operating as an unrelated screen.

## Data and Offline Strategy

The current browser `localStorage` approach will be replaced with mobile-appropriate storage:

- Application preferences in key-value storage
- Saved cycles in a structured local database
- Authentication credentials in secure device storage
- Optional cloud backup and synchronization through Firebase

The recommended identity model is optional authentication. Users should be able to calculate and save data offline, with the option to create an account for backup and synchronization.

## Firebase and AI Security

The existing AI function should be retained conceptually but secured before native release. Required changes include:

- Firebase App Check for Android and iOS
- Authentication-aware requests where appropriate
- Per-user or per-device rate limiting
- Request schema and size validation
- Strict validation of AI responses
- Safe native rendering of AI-generated text
- Usage monitoring and budget controls
- Clear timeout and failure handling

The paid AI endpoint must not remain an unrestricted public HTTP endpoint.

## Delivery Phases

### Phase 1: Product definition

- Confirm first-release scope
- Define supported countries and currencies
- Document user journeys
- Define offline and account behavior
- Document formulas and assumptions

### Phase 2: Calculation engine

- Extract calculations from the current interface
- Fix production-cycle and culling behavior
- Add strict input validation
- Establish gross-margin terminology
- Create known calculation scenarios
- Add comprehensive unit tests

### Phase 3: Design system

- Define typography, colors, spacing, buttons, fields, cards, and charts
- Design Android and iOS screen behavior
- Design loading, empty, error, and offline states
- Support accessibility and device text scaling
- Finalize app icon and splash-screen assets

### Phase 4: React Native and Expo foundation

- Establish the Expo and TypeScript project
- Configure native navigation
- Configure application state
- Configure local persistence
- Establish development, preview, and production environments
- Configure Android and iOS application identifiers

### Phase 5: Feature implementation

Implement features in complete vertical slices:

1. Settings and currency
2. New-calculation workflow
3. Calculation results
4. Saved-cycle history
5. Secure AI insights
6. Optional authentication and cloud backup

### Phase 6: Native capabilities

- Offline database
- Network-state handling
- Shareable results
- PDF or spreadsheet export
- Push reminders, if included in scope
- Analytics and crash reporting
- App Check and secure credential storage

### Phase 7: Quality assurance

- Unit tests for every financial formula
- Validation and extreme-input tests
- Android physical-device and emulator tests
- iPhone physical-device and simulator tests
- Offline and reconnection tests
- Small- and large-screen tests
- Accessibility and font-scaling tests
- Backend abuse and malformed-response tests

### Phase 8: Store release

For Android:

- Google Play developer account
- Package identifier and signed application bundle
- Privacy policy and Data Safety declaration
- Store listing and screenshots
- Internal and closed testing

For iOS:

- Apple Developer membership
- Bundle identifier and signing configuration
- App privacy declarations
- Store listing and screenshots
- TestFlight testing
- App Review submission

## Development Environment Considerations

Android development can be performed with Android Studio on the current development machine. Building and testing directly in the iOS Simulator requires macOS and Xcode. Expo cloud build services can assist with iOS builds, but final device testing and App Store release responsibilities still need to be planned.

## Immediate Next Step

No native code should be written until the team approves:

1. The first-release feature scope
2. The formula and assumption specification
3. The screen map and user journeys
4. The offline and account strategy
5. The definition of a valid calculation result

Once these are approved, implementation should begin with the tested calculation engine, followed by the React Native and Expo application foundation.

## Final Direction

> **BirdFeathers will be rebuilt using React Native, Expo, and TypeScript as a native Android and iOS application.**
>
> The existing web project is the prototype and requirements reference. It will not simply be wrapped and shipped as the final mobile architecture.
