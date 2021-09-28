### Manager Filter

&#9745; User sees full lists of managers on clicking input field

&#9745; Lists shows a max of two but can be scrolled

&#9745; Matching results appear according to input query

&#9745; Highlighted manager is selected when user hits enter key in input field

&#9745; User can navigate list using up and down arrows

&#9745; Entered value is retained on losing focus, filter reapplied once focus is back.

#### State Management
The question recommended I use Redux so I created a version that relied on receiving the API data from the store.
However since my go to for a implementation like this would be to fetch the data required by the component from a hook
I also implemented that.

#### UI Choices
As the question stated I was not allowed using any existing dropdown module I decided to forego any UI library I would 
normally use (such as Material-UI) and just build everything myself. Along with those I chose to use emotion for my 
styling needs, usually I would use JSS however I decided to give emotion a try as I had not used it before and it is
of interest to me since MUI v5 has switched to it.

#### Code Styling
I added the standard eslint and prettier config I tend to use for projects like this, including a pre-commit hook to
ensure code cannot be pushed without meeting my styling guidelines.

#### Tests
I implemented some basic unit tests using React Testing Library. I would usually use Enzyme for this but seeing as it
is not possible to do so with React 17+ without an unofficial adapter I opted for RTL instead. 