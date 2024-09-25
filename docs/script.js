console.log("Script starting");

let svg;

function initializeGraph() {
    console.log("Initializing graph");
    const elements = {
        graph: document.getElementById('graph') || createElementIfMissing('graph'),
        sidebar: document.getElementById('sidebar') || createElementIfMissing('sidebar', 'side-panel'),
        initialPanel: document.getElementById('initial-panel') || createElementIfMissing('initial-panel', 'side-panel'),
        showIntroButton: document.getElementById('show-intro-button') || createElementIfMissing('show-intro-button', '', 'button', 'Help'),
        titleImageContainer: document.getElementById('title-image') || createElementIfMissing('title-image')
    };

    console.log("Elements initialized:", elements);

    // Create connections
    const connections = [
        [1, 2], [2, 3], [4, 5], [5, 6], [7, 8], [9, 10], [10, 11]
    ];

    // Calculate positions for week nodes
    const radius = 40; // Increase this value to make bubbles larger
    const padding = 70; // Increased padding to make room for the title
    const width = elements.graph.clientWidth - padding * 2;
    const height = elements.graph.clientHeight - padding * 2;

    // Define fixed positions for each week
    const fixedPositions = [
        { x: 0.2, y: 0.2 },  // Week 1
        { x: 0.5, y: 0.15 },  // Week 2
        { x: 0.25, y: 0.4 },  // Week 3
        { x: 0.6, y: 0.5 },  // Week 4
        { x: 0.7, y: 0.25 },  // Week 5
        { x: 0.9, y: 0.2 },  // Week 6
        { x: 0.7, y: 0.6 },  // Week 7
        { x: 0.65, y: 0.8 },  // Week 8
        { x: 0.45, y: 0.6 },  // Week 9
        { x: 0.175, y: 0.65 },  // Week 10
        { x: 0.35, y: 0.8 },  // Week 11
        { x: 0.8, y: 0.9 }   // Week 12
    ];

    // Create nodes with fixed positions
    const nodes = fixedPositions.map((pos, i) => ({
        id: i,
        x: padding + pos.x * width,
        y: padding + pos.y * height
    }));

    // Set initial state
    document.body.classList.remove('sidebar-closed');
    elements.initialPanel.style.transform = 'translateX(0)';
    elements.sidebar.style.transform = 'translateX(100%)';

    for (const [name, element] of Object.entries(elements)) {
        console.log(`${name} element:`, element);
    }

    // Function to create missing elements
    function createElementIfMissing(id, className = '', tag = 'div', text = '') {
        console.warn(`Creating missing element: ${id}`);
        const element = document.createElement(tag);
        element.id = id;
        if (className) element.className = className;
        if (text) element.textContent = text;
        document.body.appendChild(element);
        return element;
    }

    console.log("Initial panel element:", elements.initialPanel);
    console.log("Initial panel innerHTML before:", elements.initialPanel.innerHTML);

    // Always set the content of the initial panel
    elements.initialPanel.innerHTML = `
        <h2>Welcome to the Cybernetic Countercultures Intensive</h2>
        <p>This site hosts our course materials, session recordings, and other resources.</p>
        
        <h3>How to Navigate:</h3>
        <ul>
            <li>Click on any week bubble to view details about that week's content.</li>
            <li>The lines between bubbles connect weeks that are part of the same unit.</li>
            <li>Use this panel to get an overview of the course structure (to bring it back up, click the "Help" button).</li>
        </ul>
        <h3>Course Overview:</h3>
        <p>What if there were a road less taken in the history of cybernetics — one with profound implications for how we understand technology today?</p>
        <p>Alongside the well-known cybernetics of command and control, of informatics and machine intelligence, in the 1960s and 1970s a more organic cybernetic mode also arose, an ecological line of inquiry that foregrounded the complex internal and interactive behaviors of living systems.</p> 
        <p>A 12-week online course led by Dr. Bruno Clarke and Dr. David McConville of Gaian Systems, and co-produced by Gray Area, the Cybernetic Countercultures Intensive will take this alternative ecological route through the larger history of cybernetics. Our aim is to recover and revive the organic and ecological lines of systems thinking and then to venture toward new ways of conceiving and building advanced technological systems — from machines that work in symbiosis with living processes to adaptive architectures and regenerative infrastructures. Join us on a voyage of rediscovery seeking not to imitate life but to integrate the technosphere with the biosphere, to design a technological paradigm grounded in the sensitivity and sentience of the living world.</p>
        <h3>Info Session:</h3>
        <!-- YouTube Video Embed -->
        <div class="video-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/bqDfL8BVR_k?si=D9dV5S6bVkvHoQjf" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    `;

    console.log("Initial panel innerHTML after:", elements.initialPanel.innerHTML);

     // Create SVG element
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `0 0 ${elements.graph.clientWidth} ${elements.graph.clientHeight}`);
    elements.graph.appendChild(svg);

    // Ensure the initial panel is visible
    showInitialPanel();
    addCloseButton(elements.initialPanel, closeInitialPanel);

    // Function to show initial panel
    function showInitialPanel() {
        document.body.classList.remove('sidebar-closed');
        elements.initialPanel.style.transform = 'translateX(0)';
        elements.sidebar.style.transform = 'translateX(100%)'; // Hide sidebar if it's open
        drawConnections(); // Redraw connections after layout shift
    }

    // Add event listener to the show intro button
    elements.showIntroButton.addEventListener('click', showInitialPanel);

    // Function to close initial panel
    function closeInitialPanel() {
        document.body.classList.add('sidebar-closed');
        document.getElementById('initial-panel').style.transform = 'translateX(100%)';
        setTimeout(() => {
            drawConnections(); // Redraw connections after layout shift
        }, 300); // Match this to your CSS transition time
    }

    // Add close button to initial panel
    addCloseButton(elements.initialPanel, closeInitialPanel);

    // Function to add close button
    function addCloseButton(panel, closeFunction) {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Hide';
        closeButton.className = 'panel-close-button'; // Add this line
        closeButton.onclick = closeFunction;
        panel.appendChild(closeButton);
    }

    // Insert title image
    if (!elements.titleImageContainer.querySelector('img')) {
        const img = document.createElement('img');
        img.src = './ccilogo.png'; // Update this path to match your image file location
        img.alt = 'Course Title';
        elements.titleImageContainer.appendChild(img);
    }

    console.log("SVG created and appended");

    // Draw connections
    function drawConnections() {
        // Remove existing lines
        svg.querySelectorAll('line').forEach(line => line.remove());

        const graphWidth = document.body.classList.contains('sidebar-closed') 
            ? window.innerWidth 
            : elements.graph.clientWidth;

        // Update SVG viewBox
        svg.setAttribute("viewBox", `0 0 ${graphWidth} ${elements.graph.clientHeight}`);

        // Update week node positions
        svg.querySelectorAll('g').forEach((weekNode, i) => {
            const circle = weekNode.querySelector('circle');
            const text = weekNode.querySelector('text');
            const x = fixedPositions[i].x * graphWidth;
            const y = fixedPositions[i].y * elements.graph.clientHeight;
            
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            text.setAttribute("x", x);
            text.setAttribute("y", y);
        });

        // Draw new lines
        connections.forEach(([start, end]) => {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const startX = fixedPositions[start].x * graphWidth;
            const startY = fixedPositions[start].y * elements.graph.clientHeight;
            const endX = fixedPositions[end].x * graphWidth;
            const endY = fixedPositions[end].y * elements.graph.clientHeight;

            line.setAttribute("x1", startX);
            line.setAttribute("y1", startY);
            line.setAttribute("x2", endX);
            line.setAttribute("y2", endY);
            line.setAttribute("stroke", "#ccc");
            line.setAttribute("stroke-width", "2");
            svg.insertBefore(line, svg.firstChild); // Insert lines before circles so they appear behind
        });
    }

    drawConnections();

    const bubbleColors = [
        "#78BC61", "#F8DD8B", "#F8DD8B", "#F8DD8B", "#C0C781", 
        "#C0C781", "#C0C781", "#D54F67", "#D54F67", "#AF988C", 
        "#AF988C", "#AF988C"
    ];
    
    const textColors = [
        "#D6D6D6", "#D6D6D6", "#D6D6D6", "#D6D6D6", "#231818", 
        "#231818", "#231818", "#D6D6D6", "#D6D6D6", "#D6D6D6", 
        "#D6D6D6", "#D6D6D6"
    ];

    // Create week nodes
    for (let i = 0; i < 12; i++) {
        const weekNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", fixedPositions[i].x * elements.graph.clientWidth);
        circle.setAttribute("cy", fixedPositions[i].y * elements.graph.clientHeight);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", bubbleColors[i]);
        circle.setAttribute("stroke-width", "2");
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", fixedPositions[i].x * elements.graph.clientWidth);
        text.setAttribute("y", fixedPositions[i].y * elements.graph.clientHeight);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "central");
        text.setAttribute("class", "week-number");
        text.textContent = `Week ${i + 1}`;
        
        weekNode.appendChild(circle);
        weekNode.appendChild(text);
        weekNode.onclick = () => showWeekContent(i + 1);
        svg.appendChild(weekNode);
    }

    console.log("Week nodes created");
    console.log("Script completed");
}

function showWeekContent(weekNumber) {
    console.log(`Showing content for week ${weekNumber}`);
    const sidebar = document.getElementById('sidebar');
    const initialPanel = document.getElementById('initial-panel');
    
    if (sidebar && initialPanel) {
        document.body.classList.remove('sidebar-closed');
        sidebar.style.transform = 'translateX(0)';
        initialPanel.style.transform = 'translateX(100%)'; // Hide initial panel
        
        const weekDetail = weekDetails.find(detail => detail.week === weekNumber);
        
        if (weekDetail) {
            sidebar.innerHTML = `
                <button class="panel-close-button" onclick="closeSidebar()">&times;</button>
                <h2>Week ${weekNumber}</h2>
                <h2>${weekDetail.title}</h2>
                <p>${weekDetail.description}</p>
                <h3>Suggested Readings:</h3>
                <ul>
                    ${weekDetail.materials ? weekDetail.materials.map(material => 
                        `<li><a href="#" onclick="downloadFile('${material.filename}')">${material.name}</a></li>`
                    ).join('') : 'No materials available'}
                </ul>
                <h3>Additional Materials:</h3>
                <ul>
                    ${weekDetail.readings ? weekDetail.readings.map(readings => 
                        `<li><a href="#" onclick="downloadFile('${readings.filename}')">${readings.name}</a></li>`
                    ).join('') : 'No readings available'}
                </ul>
            `;
        } else {
            sidebar.innerHTML = `
                <button class="panel-close-button" onclick="closeSidebar()">&times;</button>
                <h2>Week ${weekNumber}</h2>
                <p>Content for this week is not available yet.</p>
            `;
        }
        
        setTimeout(() => {
            drawConnections(); // Redraw connections after layout shift
        }, 300); // Match this to your CSS transition time
    } else {
        console.error('Sidebar or initial panel element not found');
    }
}

function closeSidebar() {
    document.body.classList.add('sidebar-closed');
    document.getElementById('sidebar').style.transform = 'translateX(100%)';
    setTimeout(() => {
        drawConnections(); // Redraw connections after layout shift
    }, 300); // Match this to your CSS transition time
}

// Global variable to store week details
let weekDetails = [];

// Fetch the week details
fetch('weekDetails.json')
    .then(response => response.json())
    .then(data => {
        weekDetails = data;
        console.log('Week details loaded:', weekDetails);
    })
    .catch(error => console.error('Error loading week details:', error));

function downloadFile(filename) {
    window.open = `./course-files/${filename}, '_blank'`;
}

// Make sure these functions are defined in the global scope
window.closeSidebar = closeSidebar;
window.showWeekContent = showWeekContent;

// Call initializeGraph when the DOM is fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeGraph);
} else {
    initializeGraph();
}

window.addEventListener('resize', () => {
    drawConnections(); // This will handle everything now
});
