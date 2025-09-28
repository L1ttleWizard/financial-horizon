// src/data/treeData.ts

export interface TreeStage {
    stage: number;
    imagePath: string;
    minNetWorth: number; // Минимальный чистый капитал для этой стадии
}

export const treeData: TreeStage[] = [
    { stage: 0, imagePath: '/illustrations/tree-stage-0.svg', minNetWorth: -Infinity },
    { stage: 1, imagePath: '/illustrations/tree-stage-1.svg', minNetWorth: 0 },
    { stage: 2, imagePath: '/illustrations/tree-stage-2.svg', minNetWorth: 500 },
    { stage: 3, imagePath: '/illustrations/tree-stage-3.svg', minNetWorth: 1500 },
    { stage: 4, imagePath: '/illustrations/tree-stage-4.svg', minNetWorth: 3000 },
];

// Вспомогательная функция, которая определяет стадию дерева по капиталу
export const getTreeStageForNetWorth = (netWorth: number): TreeStage => {
    // Идем с конца (от самого большого к самому маленькому), чтобы найти первую подходящую стадию
    for (let i = treeData.length - 1; i >= 0; i--) {
        if (netWorth >= treeData[i].minNetWorth) {
            return treeData[i];
        }
    }
    return treeData[0]; // По умолчанию возвращаем самую первую стадию
};