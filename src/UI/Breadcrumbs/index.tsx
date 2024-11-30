import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
}

export default function IconBreadcrumbs({
  stack,
}: {
  stack: { href: string; icon: React.ReactElement; label: string }[];
}) {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
        {stack?.splice(0, stack.length - 1)?.map(({ href, icon, label }, index) => (
          <Link key={index} href={"/" + href} className="flex gap-1 items-center hover:underline-offset-2">
            {icon}
            {label}
          </Link>
        ))}
        <Typography sx={{ color: "text.primary", display: "flex", alignItems: "center" }}>
          {stack[stack.length - 1]?.icon}
          {stack[stack.length - 1]?.label}
        </Typography>
      </Breadcrumbs>
    </div>
  );
}
