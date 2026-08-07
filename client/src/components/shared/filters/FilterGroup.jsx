
const FilterGroup = ({ title, icon: Icon, children, action }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between px-1">
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {Icon && <Icon className="size-3.5 text-brand-orange" />}
        {title}
      </p>
      {action}
    </div>
    {children}
  </div>
)
export default FilterGroup