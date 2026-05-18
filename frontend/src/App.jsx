import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import MesShell from "./components/layout/MesShell";
// import LoginPage from "./components/pages/LoginPage";
import { getLines } from "./api/line.api";
import {
  getLineBySlug,
  lines as mockLines,
  normalizeLineFromApi,
  sectionList,
} from "./data/lines";
// import { useAuth } from "./contexts/AuthContext";
import "./globals.css";
import "./styles/refactor.css";
import "./styles/dashboard.css";
import "./styles/dashboardProduction.css";
import "./styles/dashboardGraph.css";
import "./styles/dashboardImage.css";

const HOME_SECTION = "line-maintenance";

function isValidSection(value) {
  return sectionList.some((item) => item.slug === value);
}

function normalizeApiLines(data) {
  if (!Array.isArray(data) || data.length === 0) return mockLines;

  return data.map((item) => {
    const normalized = normalizeLineFromApi(item);
    const mock =
      mockLines.find(
        (line) =>
          line.slug === normalized.slug || line.code === normalized.code,
      ) || {};
    return {
      ...mock,
      ...normalized,
    };
  });
}

function getSafeDefaultSection(hasPermission, getDefaultSection) {
  if (hasPermission(HOME_SECTION)) return HOME_SECTION;
  return getDefaultSection();
}

function MesShellWrapper({ forcedSection }) {
  const params = useParams();
  const activeSection = forcedSection || params.activeSection;
  const lineSlug = params.lineSlug;
  const [lineList, setLineList] = useState(mockLines);
  // const { isAuthenticated, hasPermission, getDefaultSection } = useAuth();

  useEffect(() => {
    let alive = true;

    async function fetchLines() {
      try {
        const data = await getLines();
        if (!alive) return;
        setLineList(normalizeApiLines(data));
      } catch (error) {
        console.warn(
          "Load lines from API failed. Use mock data instead.",
          error,
        );
        if (alive) setLineList(mockLines);
      }
    }

    fetchLines();

    return () => {
      alive = false;
    };
  }, []);

  const firstLine = lineList[0] || mockLines[0];
  const currentLine = useMemo(
    () => getLineBySlug(lineSlug, lineList) || firstLine,
    [firstLine, lineList, lineSlug],
  );

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  if (!isValidSection(activeSection)) {
    return (
      <Navigate
        to={`/${HOME_SECTION}/${firstLine.slug}`}
        replace
      />
    );
  }

  if (!getLineBySlug(lineSlug, lineList)) {
    return <Navigate to={`/${activeSection}/${firstLine.slug}`} replace />;
  }

  return (
    <MesShell
      line={currentLine}
      activeSection={activeSection}
      lineList={lineList}
    />
  );
}

function LegacyRouteRedirect() {
  const { lineSlug, activeSection } = useParams();

  if (isValidSection(activeSection)) {
    return <Navigate to={`/${activeSection}/${lineSlug}`} replace />;
  }

  return (
    <Navigate
      to={`/${HOME_SECTION}/${mockLines[0].slug}`}
      replace
    />
  );
}

function RootRedirect() {
  return (
    <Navigate
      to={`/${HOME_SECTION}/${mockLines[0].slug}`}
      replace
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/" element={<RootRedirect />} />

        {sectionList.map((section) => (
          <Route
            key={section.slug}
            path={`/${section.slug}/:lineSlug`}
            element={<MesShellWrapper forcedSection={section.slug} />}
          />
        ))}

        <Route
          path="/:lineSlug/:activeSection"
          element={<LegacyRouteRedirect />}
        />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
