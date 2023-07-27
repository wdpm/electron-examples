export class Category {
  id: number;
  idPath: string;
  title: string;
  parentId: number;
  level: number;
  isFold: boolean;
  hasChild: boolean;
  timeCreate: number;
  isSelected: boolean;
  order: number;
  static getMetaData() {
    return {
      name: "Category",
      columns: {
        id: { primaryKey: true, autoIncrement: true },
        title: { notNull: true, dataType: "string" },
        parentId: { notNull: true, dataType: "number" },
      },
    };
  }
}
